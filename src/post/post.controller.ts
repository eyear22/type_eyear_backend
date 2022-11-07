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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  sendPost(@UploadedFile() file: Express.Multer.File){
    console.log(file);
    this.postService.sendPost(file);
    return `ok`;
  }
}
