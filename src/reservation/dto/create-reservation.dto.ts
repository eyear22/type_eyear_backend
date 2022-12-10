import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { Patient } from 'src/hospital/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateReservationDto {
  @ApiProperty({
    description: '예약 날짜',
  })
  reservationDate: Date;

  @IsNumberString()
  @ApiProperty({ description: '면회 시간대 인덱스' })
  timetableIndex: number;

  @IsNumberString()
  @ApiProperty({ description: '대면/비대면 여부. T인 경우 대면' })
  faceToface: boolean;
}
