import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Storage } from '@google-cloud/storage';
import { analyzeVideoTranscript } from '../stt/G_Function';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/user/entities/user.entity';
import { Keyword } from 'src/keywords/entities/keyword.entity';
import { NameWord } from 'src/keywords/entities/nameWord.entity';
import { KeywordsService } from 'src/keywords/keywords.service';

@Injectable()
export class PostService {
  constructor(
    private storage: Storage,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    @InjectRepository(NameWord)
    private nameWordRepository: Repository<NameWord>,

    private readonly keywordService: KeywordsService,
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.nameWordRepository = nameWordRepository;
    this.keywordRepository = keywordRepository;
    this.storage = new Storage({
      projectId: `${process.env.PROJECT_ID}`,
      keyFilename: `${process.env.KEYPATH}`,
    });
  }

  async sendPost(
    createpostDto: CreatePostDto,
    video: Express.Multer.File,
    userId: number,
  ): Promise<any> {
    const bucket = this.storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
    const nowDate = Date.now();
    const filename = nowDate + '.mp4';
    const blob = bucket.file(`${nowDate}.mp4`);
    const blobStream = blob.createWriteStream();

    const user = await this.userRepository.find({
      where: {
        id: userId,
      },
      relations: {
        patient: true,
        hospital: true,
      },
    });

    const nameWords = await this.nameWordRepository
      .createQueryBuilder('nameWord')
      .select('nameWord.word')
      .leftJoin('nameWord.user', 'user')
      .where('user.id = :userId', { userId })
      .execute();

    const keywords = await this.keywordRepository
      .createQueryBuilder('keyword')
      .select('keyword.word')
      .leftJoin('keyword.user', 'user')
      .where('user.id = :userId', { userId })
      .execute();

    blobStream.on('error', (err) => {
      console.error(err);
    });

    let sttResult = '';
    blobStream.on('finish', async () => {
      sttResult = analyzeVideoTranscript(
        `${filename}`,
        video.buffer,
        nameWords,
        keywords,
      );

      await this.keywordService.extract(sttResult, userId, user[0].patient.id);

      const result = await this.postRepository
        .createQueryBuilder()
        .insert()
        .into(Post)
        .values({
          video: () =>
            `gs://${process.env.GCLOUD_STORAGE_BUCKET}/${nowDate}.mp4`,
          text: () =>
            `gs://${process.env.GCLOUD_STORAGE_BUCKET}/${nowDate}.txt`,
          check: () => `${false}`,
          stampNumber: () => `${createpostDto.stampNumber}`,
          cardNumber: () => `'${createpostDto.cardNumber}'`,
          hospital: () => `'${user[0].patient.id}'`,
          user: () => `'${user[0].patient.id}'`,
          patient: () => `'${user[0].patient.id}'`,
        })
        .execute();

      return result;
    });

    blobStream.end(video.buffer);
  }

  async getPostDetail(postId: number) {
    // todo: user 정보 일치하는지 확인
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['not existed post'],
        error: 'Not Found',
      });
    }
    return post;
  }
}
