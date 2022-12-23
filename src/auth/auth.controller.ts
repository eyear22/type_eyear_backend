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
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
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
    type: LoginResponse,
  })
  async login(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.login(req.user);
    res.setHeader('Authorization', data.tokens.access_token);

    return res
      .status(HttpStatus.OK)
      .send({ message: 'success', tokens: data.tokens, user: data.user });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/test')
  async getHello(@Req() req) {
    return 'hello';
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  async getToken(@Req() req) {
    return await this.authService.refreshTokens(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @ApiOperation({
    summary: '로그아웃 API',
    description: '로그아웃 --> 프론트에서 저장한 토큰을 삭제해주세요!!',
  })
  async logout(@Req() req: Request) {
    return await this.authService.logout(req.user);
  }
}
