import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';

class ReservationData {
  @ApiProperty({ description: '신청된 예약 아이디', example: 1 })
  reservation_id: number;

  @ApiProperty({ description: '면회를 신청한 날짜', example: '22/12/12' })
  reservation_createdAt: string;

  @ApiProperty({ description: '면회를 하고자하는 날짜', example: '22/12/12' })
  reservation_reservationDate: string;

  @ApiProperty({ description: '면회 예약 신청 시간 인덱스', example: 1 })
  reservation_timetableIndex: number;

  @ApiProperty({ description: '대면 면회 여부', example: true })
  reservation_faceToface: boolean;

  @ApiProperty({ description: '면회 예약 승인 여부', example: 1 })
  reservation_approveCheck: number;
}

class ALlReservationResponseData {
  @ApiProperty({ description: '승인 여부 확인 안함' })
  '0': ReservationData[];

  @ApiProperty({ description: '승인' })
  '1': ReservationData[];

  @ApiProperty({ description: '거부' })
  '-1': ReservationData[];
}

export abstract class ReservationListResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      '0': [
        {
          reservation_id: 10,
          reservation_createdAt: '22/12/15',
          reservation_reservationDate: '22/12/02',
          reservation_timetableIndex: 0,
          reservation_faceToface: 1,
          reservation_approveCheck: 0,
        },
      ],
      '1': [
        {
          reservation_id: 7,
          reservation_createdAt: '22/12/15',
          reservation_reservationDate: '22/12/13',
          reservation_timetableIndex: 0,
          reservation_faceToface: 1,
          reservation_approveCheck: 1,
        },
        {
          reservation_id: 8,
          reservation_createdAt: '22/12/15',
          reservation_reservationDate: '22/12/23',
          reservation_timetableIndex: 0,
          reservation_faceToface: 1,
          reservation_approveCheck: 1,
        },
      ],
      '-1': [
        {
          reservation_id: 11,
          reservation_createdAt: '22/12/15',
          reservation_reservationDate: '22/12/11',
          reservation_timetableIndex: 0,
          reservation_faceToface: 1,
          reservation_approveCheck: -1,
        },
      ],
    },
  })
  reservations: ALlReservationResponseData;
}
