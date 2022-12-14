import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Storage } from '@google-cloud/storage';
import { analyzeVideoTranscript } from '../stt/G_Function';
import { CreatePostDto } from './dto/create-post.dto';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { Patient } from 'src/hospital/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';
import e from 'express';

@Injectable()
export class PostService {
  constructor(
    private storage: Storage,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,

    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.postRepository = postRepository;
    this.hospitalRepository = hospitalRepository;
    this.patientRepository = patientRepository;
    this.userRepository = userRepository;
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

    blobStream.on('error', (err) => {
      console.error(err);
    });

    blobStream.on('finish', async () => {
      await analyzeVideoTranscript(`${filename}`, video.buffer);

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

  async getPostDetail(postId: number, userId: number) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id =:postId', { postId })
      .andWhere('post.userId =:userId', { userId })
      .execute();

    if (post.length === 0) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['not existed post'],
        error: 'Not Found',
      });
    } else if (post.length > 1) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['유효하지 않은 우편 및 개인 정보입니다.'],
        error: 'Bad Request',
      });
    }

    const result = {
      id: post[0].post_id,
      video: post[0].post_video,
      text: post[0].post_text,
      check: post[0].post_check,
      stampNumber: post[0].post_stampNumber,
      cardNumber: post[0].post_cardNumber,
      createdAt: post[0].post_createdAt.toISOString().split('T')[0],
    };

    return result;
  }
}
