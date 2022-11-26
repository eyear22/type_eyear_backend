import { ApiProperty } from '@nestjs/swagger';

export class PostDetailParamDto {
  @ApiProperty({ description: 'post detail request parameter', example: 1 })
  postId: number;
}
