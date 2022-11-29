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
      keyFilename: `${process.env.KEYPATH}`
    });
  }

  async sendPost(
    createpostDto: CreatePostDto,
    video: Express.Multer.File,
  ): Promise<any> {
    const bucket = this.storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
    const nowDate = Date.now();
    const filename = nowDate + '.mp4';
    const blob = bucket.file(`${nowDate}.mp4`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      console.error(err);
    });

    blobStream.on('finish', async () => {
      await analyzeVideoTranscript(`${filename}`, video.buffer);

      const post = {
        video: `gs://${process.env.GCLOUD_STORAGE_BUCKET}/${nowDate}.mp4`,
        text: `gs://${process.env.GCLOUD_STORAGE_BUCKET}/${nowDate}.txt`,
        check: false,
        stampNumber: createpostDto.stampNumber,
        cardNumber: createpostDto.cardNumber,
        hospital: null,
        user: null,
        patient: null,
      };

      const { ...result } = this.postRepository.save(post);

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
