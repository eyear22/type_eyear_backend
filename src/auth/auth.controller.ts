import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { BaseResponse } from 'src/utils/swagger/base-response.dto';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({
    summary: '사용자 로그인 API',
    description: 'email과 password 정보를 통해 로그인을 진행한다',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: BaseResponse,
  })
  async login(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.login(req.user);
    res.setHeader('Authorization', data.tokens.access_token);
    res.cookie('jwt', data.tokens, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1day
    });
    return res
      .status(HttpStatus.OK)
      .send({ message: 'success', user: data.user });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/test')
  async getHello(@Req() req) {
    return 'hello';
  }

  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({
    summary: 'Access Token 재발급 API',
    description:
      '[쿠키 필수] Refresh Token을 사용하여 Access Token을 재발급 받는다',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: BaseResponse,
  })
  @Get('/refresh')
  async getToken(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.refreshToken(req.user);
    res.cookie('jwt', tokens, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1day
    });

    return res.status(HttpStatus.OK).send({ message: 'success' });
  }
}
