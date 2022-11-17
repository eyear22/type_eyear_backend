import {
  Bind,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { json } from 'stream/consumers';

@Controller('post')
@ApiTags('Post API')
@UseInterceptors(FileInterceptor('video'))
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post('')
  @ApiOperation({
    summary: '편지 보내기 API',
    description: '편지를 보낸다.',
  })
  @ApiCreatedResponse({ description: '편지를 보낸다.', type: String })
  sendPost(@Body() createpostDto: CreatePostDto, @UploadedFile() video:Express.Multer.File){
    this.postService.sendPost(createpostDto, video);
    return 'ok';
  }
}
