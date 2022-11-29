import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { EmailCheckDto } from './dto/email-check.dto';
import { UserService } from './user.service';
import { EamilCheckResponse } from './dto/email-check-response.dto';
import { CreateUserResponse } from './dto/create-user-response.dto';
import { PostsResponse } from './dto/posts-response.dto';

@Controller('user')
@ApiTags('User API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @ApiOperation({
    summary: '유저 생성 API',
    description: '유저를 생성한다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'success',
    type: CreateUserResponse,
  })
  async getUser(@Body() requestDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.createUser(requestDto);
    const result = {
      message: 'success',
      user: user,
    };
    return res.status(HttpStatus.CREATED).send(result);
  }

  @Get('emailCheck')
  @ApiOperation({
    summary: '이메일 중복 확인 API',
    description: '이메일 중복 확인 (false: 사용 불가, true: 사용 가능)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: EamilCheckResponse,
  })
  async emailCheck(
    @Query() emailCheckDto: EmailCheckDto,
    @Res() res: Response,
  ) {
    const isValid = await this.userService.emailCheck(emailCheckDto);
    const result = {
      message: 'success',
      ...isValid,
    };
    return res.status(HttpStatus.OK).send(result);
  }

  @Get('posts')
  // @UseGuards(JwtAuthGuard) // fix: 로그인 연결 후 수정
  @ApiOperation({
    summary: '개인 보낸 우편 리스트 API',
    description: '보낸 우편 리스트 확인',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: PostsResponse,
  })
  async getPosts(@Res() res: Response) {
    const posts = await this.userService.getPosts();
    const result = {
      message: 'success',
      posts: posts,
    };
    return res.status(HttpStatus.OK).send(result);
  }
}
