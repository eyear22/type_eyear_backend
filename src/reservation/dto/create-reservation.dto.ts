import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: '예약 날짜',
    example: '2022-12-12',
  })
  reservationDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '면회 시간대 인덱스', example: 1 })
  timetableIndex: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '대면/비대면 여부. T인 경우 대면',
    example: true,
  })
  faceToface: boolean;
}
