import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class EmailCheckDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ description: '이메일' })
  email: string;
}
