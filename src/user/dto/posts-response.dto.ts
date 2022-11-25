import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';

class PostsResponseData {
  post_id: number;
  post_stampNumber: number;
  post_cardNumeber: number;
  post_createdAt: Date;
}

export abstract class PostsResponse extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'response result',
    example: [
      {
        post_id: 1,
        post_stampNumber: 1,
        post_cardNumeber: 1,
        post_createdAt: '2022-11-25T08:49:39.186Z',
      },
      {
        post_id: 2,
        post_stampNumber: 2,
        post_cardNumeber: 2,
        post_createdAt: '2022-11-25T08:49:39.186Z',
      },
    ],
  })
  posts: PostsResponseData[];
}
