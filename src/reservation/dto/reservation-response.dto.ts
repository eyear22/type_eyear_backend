import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';

class ReservationResponseData {
  @ApiProperty({ description: '신청된 예약 아이디', example: 1 })
  id: number;
}

export abstract class ReservationResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      id: 1,
    },
  })
  reservation: ReservationResponseData;
}
