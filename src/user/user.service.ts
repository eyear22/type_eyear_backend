import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Patient } from 'src/hospital/entities/patient.entity';
import { NameWord } from 'src/keywords/entities/nameWord.entity';
import { KeywordsService } from 'src/keywords/keywords.service';
import { Post } from 'src/post/entities/post.entity';
import { Repository } from 'typeorm';
import { ConnectPatientDto } from './dto/connect-patient.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailCheckDto } from './dto/email-check.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(NameWord)
    private nameWordRepository: Repository<NameWord>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,

    private readonly keywordService: KeywordsService,
  ) {
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.nameWordRepository = nameWordRepository;
    this.patientRepository = patientRepository;
  }

  async createUser(requestDto: CreateUserDto): Promise<any> {
    const isExist = await this.userRepository.findOneBy({
      email: requestDto.email,
    });

    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already registered email'],
        error: 'Forbidden',
      });
    }

    requestDto.password = await hash(requestDto.password, 10); // FIX ME : use env

    const { password, ...result } = await this.userRepository.save(requestDto);

    const nameResult = await this.keywordService.addPostposition(result.name);

    for (const name of nameResult) {
      await this.nameWordRepository
        .createQueryBuilder()
        .insert()
        .into(NameWord)
        .values({
          word: () => `'${name}'`,
          user: () => `'${result.id}'`,
        })
        .execute();
    }

    return result;
  }

  async emailCheck(emailCheckDto: EmailCheckDto) {
    if (!emailCheckDto.email) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Invalid value'],
        error: 'Bad Request',
      });
    }

    const isExist = await this.userRepository.findOneBy({
      email: emailCheckDto.email,
    });

    const result = {};
    if (isExist) {
      result['isValidEmail'] = false;
    } else {
      result['isValidEmail'] = true;
    }
    return result;
  }

  async getPosts(): Promise<Post> {
    // const user = this.userRepository.findOneBy({ email });
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .select('post.id')
      .addSelect('post.stampNumber')
      .addSelect('post.cardNumber')
      .addSelect('post.createdAt')
      // .where('post.user = :user', { user }) // fix: 로그인 연결 후 user 정보 이용해서 검색
      .execute();

    return posts;
  }

  async connectPatient(userId: number, requestDto: ConnectPatientDto) {
    const { hospital_id, patient_infoNumber, patient_name } = requestDto;
    const patient = await this.patientRepository
      .createQueryBuilder('patient')
      .select('patient.id')
      .addSelect('patient.name')
      .addSelect('hospital.id')
      .leftJoin('patient.hospital', 'hospital')
      .where('hospital.id = :hospital_id', { hospital_id })
      .andWhere('patient.infoNumber LIKE :patient_infoNumber', {
        patient_infoNumber: `${patient_infoNumber}%`,
      })
      .andWhere('patient.name = :patient_name', {
        patient_name,
      })
      .execute();

    if (patient.length != 1) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['수신인 정보를 다시 확인해주세요.'],
        error: 'Bad Request',
      });
    }

    const users = await this.userRepository
      .createQueryBuilder('user')
      .select('user.id')
      .leftJoin('user.patient', 'patient')
      .where('patient.id = :patient_id', { patient_id: patient[0].patient_id })
      .execute();

    if (users.length > 0) {
      console.log(users);
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['이미 연결이 완료된 환자입니다.'],
        error: 'Bad Request',
      });
    }

    try {
      await this.userRepository.update(
        { id: userId },
        {
          patient: patient[0].patient_id,
          hospital: patient[0].hospital_id,
        },
      );
    } catch (err) {
      console.log(err);
    }

    return patient[0];
  }
}
