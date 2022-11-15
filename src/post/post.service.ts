import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Bucket, Storage } from '@google-cloud/storage';
import {analyzeVideoTranscript} from "../stt/G_Function";

@Injectable()
export class PostService {
  constructor(
    private storage: Storage,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {
    this.postRepository = postRepository;
    this.storage = new Storage();
  }

  async sendPost(video: Express.Multer.File): Promise<any> {
    const bucket = this.storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
    const filename = Date.now() + '.mp4';
    // 1. 비디오 클라우드 업로드
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      console.error(err);
    });

    blobStream.on('finish', () =>{
      // 2. STT api와 연결 및 텍스트 파일 업로드
      analyzeVideoTranscript(filename, video.buffer);
    });
    // 업로드 실행
    blobStream.end(video.buffer);

  }
}
