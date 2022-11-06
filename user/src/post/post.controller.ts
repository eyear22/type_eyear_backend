import { Controller, Post } from '@nestjs/common';

@Controller('post')
export class PostController {
  @Post()
  sendPost(file: File) {
    return '편지 보내기 완료.';
  }
}
