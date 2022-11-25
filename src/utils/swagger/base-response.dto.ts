import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseResponse {
  @ApiProperty({ description: 'response message', example: 'success' })
  message: string;
}
