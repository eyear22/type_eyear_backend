import { Module } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from '@google-cloud/storage';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { User } from 'src/user/entities/user.entity';
import { Patient } from 'src/hospital/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Hospital, User, Patient])],
  controllers: [PostController],
  providers: [PostService, Storage],
  exports: [PostService],
})
export class PostModule {}
