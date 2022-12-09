import { ApiProperty } from '@nestjs/swagger';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { Patient } from 'src/hospital/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';
import { Reservation } from '../entities/reservation.entity';

export abstract class ReservationResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      reservationDate: '2022-11-26T11:32:49.244Z',
      timetableIndex: 1,
      faceToface: 0,
      hospital: Hospital,
      user: User,
      patient: Patient,
    },
  })
  reservation: Reservation;
}
