import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
          entities: [],
          synchronize: true, // Fix me : set this value to false when deploy
        };
      },
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
