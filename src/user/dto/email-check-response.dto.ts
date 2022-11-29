import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';

export abstract class EamilCheckResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({ description: 'response result', example: false })
  isValidEmail: boolean;
}
