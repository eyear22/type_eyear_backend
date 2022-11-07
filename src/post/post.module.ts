import { Module } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from '@google-cloud/storage';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService, Storage],
  exports: [PostService],
})
export class PostModule {}
