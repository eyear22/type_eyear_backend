import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReqUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  email: string;
}
