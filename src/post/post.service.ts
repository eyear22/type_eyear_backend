import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Storage } from '@google-cloud/storage';
import {analyzeVideoTranscript} from "../stt/G_Function";
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
    this.storage = new Storage();
  }

  async sendPost(createpostDto: CreatePostDto, video: Express.Multer.File): Promise<any> {
    console.log("sendPost");
    const bucket = this.storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
    console.log("bucket");
    const nowDate = Date.now();
    const filename = nowDate + '.mp4';
    const blob = bucket.file(`${nowDate}.mp4`);
    const blobStream = blob.createWriteStream();
    console.log(`${nowDate}.mp4`);
    console.log(video);

    blobStream.on('error', (err) => {
      console.error(err);
    });

    blobStream.on('finish', async () => {
      console.log("isFinish");
      analyzeVideoTranscript(`${nowDate}.mp4`, video.buffer);

      // const hospital = await this.hospitalRepository.findOneBy({
      //   id: createpostDto.hospital,
      // })

      const user = await this.userRepository.findOneBy({
        id: createpostDto.user,
      })

      // const patient = await this.patientRepository.findOneBy({
      //   id: createpostDto.patient,
      // })

      const post = {
        video: `gs://${process.env.GCLOUD_STORAGE_BUCKET}/${nowDate}.mp4`,
        text: `gs://${process.env.GCLOUD_STORAGE_BUCKET}/${nowDate}.txt`,
        check: false,
        stampNumber: createpostDto.stampNumber,
        cardNumber: createpostDto.cardNumber,
        hospital: null,
        user: user,
        patient: null
      };

      this.postRepository.save(post);
    })

    blobStream.end(video.buffer);
  }
}
