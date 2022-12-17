import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';

class User {
  @ApiProperty({ description: '개인 아이디', example: 5 })
  id: number;
}

class Patient {
  @ApiProperty({ description: '환자 아이디', example: 5 })
  id: number;

  @ApiProperty({ description: '환자 이름', example: '이필재' })
  name: string;

  @ApiProperty({ description: '환자 번호', example: 'PA1234' })
  number: string;

  @ApiProperty({
    description: '환자 입원 날짜',
    example: '2019-10-12',
  })
  inDate: string;

  @ApiProperty({ description: '환자 주민 번호', example: '661002-1******' })
  infoNumber: string;
}

class Hospital {
  @ApiProperty({ description: '병원 아이디', example: 5 })
  id: number;

  @ApiProperty({ description: '병원 이름', example: '참나무 병원' })
  name: string;

  @ApiProperty({ description: '병원 전화번호', example: '02-123-1234' })
  phoneNumber: string;

  @ApiProperty({ description: '병원 주소', example: '서울시 중랑구' })
  address: string;
}

class ResponseData {
  @ApiProperty({ description: '개인 데이터' })
  user: User;

  @ApiProperty({ description: '환자 데이터' })
  patient: Patient;

  @ApiProperty({ description: '병원 데이터' })
  hospital: Hospital;
}

export abstract class ConnectedPatientResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      user: {
        id: 11,
      },
      patient: {
        id: 5,
        number: 'BA13575',
        inDate: '2019-10-12',
        name: '이필재',
        infoNumber: '661002-1******',
      },
      hospital: {
        id: 2,
        name: '참나무 병원',
        address: '서울시 중랑구',
        phoneNumber: '02-123-1234',
      },
    },
  })
  result: ResponseData;
}
