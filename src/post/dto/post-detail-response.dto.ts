import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';
import { Post } from '../entities/post.entity';

export abstract class PostDetailResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: {
      id: 1,
      video: 'test_url',
      text: 'test_url',
      check: false,
      stampNumber: 1,
      cardNumber: 1,
      createdAt: '2022-11-26T11:32:49.244Z',
      updatedAt: '2022-11-26T11:32:49.244Z',
    },
  })
  post: Post;
}
