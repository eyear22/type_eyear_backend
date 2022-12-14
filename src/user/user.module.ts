import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { Patient } from 'src/hospital/entities/patient.entity';
import { Keyword } from 'src/keywords/entities/keyword.entity';
import { NameWord } from 'src/keywords/entities/nameWord.entity';
import { KeywordsService } from 'src/keywords/keywords.service';
import { Post } from 'src/post/entities/post.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      Keyword,
      NameWord,
      Patient,
      Hospital,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, KeywordsService],
  exports: [UserService],
})
export class UserModule {}
