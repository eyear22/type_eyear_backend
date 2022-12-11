import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';

class HospitalResponseData {
  @ApiProperty({ description: '병원 아이디', example: 5 })
  id: number;

  @ApiProperty({ description: '병원 이름', example: '참나무 병원' })
  name: string;

  @ApiProperty({ description: '병원 전화번호', example: '02-123-1234' })
  phoneNumber: string;

  @ApiProperty({ description: '병원 주소', example: '서울시 중랑구' })
  address: string;
}

export abstract class HospitalListResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: [
      {
        id: 1,
        name: '참나무 병원',
        phoneNumber: '02-123-1234',
        address: '서울시 중랑구',
      },
      {
        id: 2,
        name: '우리사랑 병원',
        phoneNumber: '02-654-2543',
        address: '서울시 노원구',
      },
    ],
  })
  hospitals: HospitalResponseData[];
}
