import {
    BadRequestException,
    ForbiddenException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ){
        this.postRepository = postRepository;
    }

    async sendPost(video: File): Promise<any>{
        
    }
}
