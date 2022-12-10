import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { KeywordsService } from './keywords.service';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  controllers: [],
  providers: [KeywordsService],
})
export class KeywordsModule {}
