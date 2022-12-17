import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from './entities/keyword.entity';
import { spawn } from 'child_process';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
  ) {
    this.keywordRepository = keywordRepository;
  }

  CUT_RATIO = 0.3;
  UPDATE_RATIO = 0.95;

  async extract(text: string, userId: number, patientId: number) {
    const result = [];

    const extractResult = spawn('python3', ['extract.py', text]);

    extractResult.stdout.on('data', (data) => {
      let keywords = data.toString('utf8');
      keywords = keywords.slice(1, -3);
      const regExp = /\(([^)]+)\)/;
      const keywordsArray = keywords.split(regExp);

      keywordsArray.forEach((value, index) => {
        if (index % 2 === 1) {
          const temp = value.split(', ');
          if (Number(temp[1]) > this.CUT_RATIO) {
            // 일정 비율 이하 키워드는 저장하지 않음
            result.push({
              word: temp[0].slice(1, -1),
              rank: Number(temp[1]),
            });
          }
        }
      });
    });

    extractResult.on('close', async (code) => {
      if (code === 0) {
        try {
          // 업데이트 키워드 찾기
          const preKeyword = await this.keywordRepository
            .createQueryBuilder('keyword')
            .select('keyword')
            .where('keyword.userId = :userId', { userId })
            .andWhere('keyword.patientId = :patientId', { patientId })
            .execute();

          if (preKeyword.length === 0) {
            // 첫번째 키워드일 때
            for (let i = 0; i < result.length; i++) {
              await this.keywordRepository
                .createQueryBuilder()
                .insert()
                .into(Keyword)
                .values({
                  word: () => `'${result[i].word}'`,
                  rank: () => `'${result[i].rank}'`,
                  user: () => `'${userId}'`,
                  patient: () => `'${patientId}'`,
                })
                .execute();
            }
            return;
          } else {
            //  시간 가중치 업데이트
            for (let i = 0; i < preKeyword.length; i++) {
              result.push({
                word: preKeyword[i].keyword_word,
                rank: preKeyword[i].keyword_rank * this.UPDATE_RATIO,
              });
            }

            for (let i = 0; i < preKeyword.length; i++) {
              await this.keywordRepository.delete({
                id: preKeyword[i].keyword_id,
              });
            }

            result.sort((a, b) => {
              return parseFloat(b.rank) - parseFloat(a.rank);
            });

            const updateResult = result.splice(0, 20);

            for (let i = 0; i < updateResult.length; i++) {
              await this.keywordRepository
                .createQueryBuilder()
                .insert()
                .into(Keyword)
                .values({
                  word: () => `'${updateResult[i].word}'`,
                  rank: () => `'${updateResult[i].rank}'`,
                  user: () => `'${userId}'`,
                  patient: () => `'${patientId}'`,
                })
                .execute();
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log('프로세스 종료:', code);
      }
    });
  }

  isSingleCharacter(text: string) {
    const strGa = 44032;
    const strHih = 55203;

    const lastStrCode = text.charCodeAt(text.length - 1);

    if (lastStrCode < strGa || lastStrCode > strHih) {
      return false; // 한글이 아닐 경우 false 반환
    }
    return (lastStrCode - strGa) % 28 === 0;
  }

  addPostposition(text: string) {
    const word1 = text + (this.isSingleCharacter(text) ? '' : '이');
    const word2 = text + (this.isSingleCharacter(text) ? '는' : '이는');
    const word3 = text + (this.isSingleCharacter(text) ? '가' : '이가');
    const word4 = text + (this.isSingleCharacter(text) ? '랑' : '이랑');
    const word5 = text + (this.isSingleCharacter(text) ? '의' : '이의');
    const word6 = text + (this.isSingleCharacter(text) ? '에' : '이에');
    const words = [word1, word2, word3, word4, word5, word6];
    return words;
  }
}
