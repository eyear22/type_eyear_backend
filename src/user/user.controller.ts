import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { json } from 'stream/consumers';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailCheckDto } from './dto/email-check.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @ApiOperation({
    summary: '유저 생성 API',
    description: '유저를 생성한다.',
  })
  @ApiCreatedResponse({ description: '유저를 생성한다.', type: json })
  async getUser(@Body() requestDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.createUser(requestDto);
    return res.status(HttpStatus.CREATED).json(user);
  }

  @Get('emailCheck')
  @ApiOperation({
    summary: '이메일 중복 확인 API',
    description: '이메일 중복 확인',
  })
  @ApiCreatedResponse({
    description: '회원가입시 이메일 중복 확인',
    type: json,
  })
  async emailCheck(@Query() emailCheckDto: EmailCheckDto) {
    return await this.userService.emailCheck(emailCheckDto);
  }
}
