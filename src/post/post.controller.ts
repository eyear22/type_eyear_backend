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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
@UseInterceptors(FileInterceptor('video'))
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  sendPost(@Body() createpostDto: CreatePostDto, @UploadedFile() video:Express.Multer.File){
    this.postService.sendPost(createpostDto, video);
    return 'ok';
  }
}
