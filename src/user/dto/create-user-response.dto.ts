import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';

class CreateUserResponseData {
  email: string;
  name: string;
  phoneNumber: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class CreateUserResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      email: 'testEmail@naver.com',
      name: 'testName',
      phoneNumber: '010-1111-1111',
      id: 1,
      createdAt: '2022-11-25T08:49:39.186Z',
      updatedAt: '2022-11-25T08:49:39.186Z',
    },
  })
  user: CreateUserResponseData;
}
