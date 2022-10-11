import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { json } from 'stream/consumers';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @ApiOperation({
    summary: '유저 조회 API',
    description: '유저의 정보를 조회한다.',
  })
  @ApiCreatedResponse({ description: '유저의 정보를 조회한다.', type: json })
  async getUser(@Body() requestDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.createUser(requestDto);
    return res.status(HttpStatus.CREATED).json(user);
  }
}
