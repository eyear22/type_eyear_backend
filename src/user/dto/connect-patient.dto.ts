import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConnectPatientDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '병원 아이디', example: 1 })
  hospital_id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '환자 이름' })
  patient_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '주민번호 앞자리', example: '661010' })
  patient_infoNumber: string;
}
