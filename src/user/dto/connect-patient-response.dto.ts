import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';

class ConnectPatientResponseData {
  @ApiProperty({ description: '환자 아이디', example: 5 })
  patient_id: number;

  @ApiProperty({ description: '환자 이름', example: '이필재' })
  patient_name: string;
}

export abstract class ConnectPatientResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      patient_id: 3,
      patient_name: '두환자',
    },
  })
  patient: ConnectPatientResponseData;
}
