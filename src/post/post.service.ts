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
    console.log('들어오니?');
    const bucket = this.storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
    const filename = Date.now() + '.mp4';
    // 1. 비디오 클라우드 업로드
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      console.error(err);
    });

    // 업로드 실행
    blobStream.end(video.buffer);
  }
}
