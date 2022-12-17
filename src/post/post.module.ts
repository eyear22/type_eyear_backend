import { Module } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from '@google-cloud/storage';
import { User } from 'src/user/entities/user.entity';
import { Keyword } from 'src/keywords/entities/keyword.entity';
import { NameWord } from 'src/keywords/entities/nameWord.entity';
import { KeywordsService } from 'src/keywords/keywords.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Keyword, NameWord])],
  controllers: [PostController],
  providers: [PostService, KeywordsService, Storage],
  exports: [PostService],
})
export class PostModule {}
