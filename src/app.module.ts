import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Hospital } from './hospital/entities/hospital.entity';
import { Patient } from './hospital/entities/patient.entity';
import { Room } from './hospital/entities/room.entity';
import { Ward } from './hospital/entities/ward.entity';
import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';
import { ReservationModule } from './reservation/reservation.module';
import { Reservation } from './reservation/entities/reservation.entity';
import { Keyword } from './keywords/entities/keyword.entity';
import { KeywordsModule } from './keywords/keywords.module';
import { NameWord } from './keywords/entities/nameWord.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: process.env.MYSQLDB_HOST,
          port: parseInt(process.env.MYSQLDB_DOCKER_PORT, 10),
          username: process.env.MYSQLDB_USER,
          password: process.env.MYSQLDB_PASSWORD,
          database: process.env.MYSQLDB_DATABASE,
          entities: [
            User,
            Hospital,
            Patient,
            Room,
            Ward,
            Post,
            Reservation,
            Keyword,
            NameWord,
          ],
          synchronize: true, // Fix me : set this value to false when deploy
        };
      },
    }),
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    PostModule,
    ReservationModule,
    KeywordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
