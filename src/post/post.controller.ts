import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { PostDetailParamDto } from './dto/post-detail-param.dto';
import { PostDetailResponse } from './dto/post-detail-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
  sendPost(
    @Body() createpostDto: CreatePostDto,
    @UploadedFile() video: Express.Multer.File,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const post = this.postService.sendPost(createpostDto, video, req.user.id);
    return res.status(HttpStatus.CREATED).json(post);
  }

  @Get('detail/:postId')
  @UseGuards(JwtAuthGuard) // fix: 로그인 연결 후 수정
  @ApiOperation({
    summary: '개인 보낸 우편 상세 페이지 확인 API',
    description: '보낸 우편 상세 확인',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: PostDetailResponse,
  })
  async getPostDetail(
    @Param() param: PostDetailParamDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!param) {
      return new BadRequestException('required parameter');
    }

    const post = await this.postService.getPostDetail(
      param.postId,
      req.user.id,
    );

    const result = {
      message: 'success',
      post: post,
    };
    return res.status(HttpStatus.OK).send(result);
  }
}
