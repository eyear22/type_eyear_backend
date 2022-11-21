import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['jwt'];
          if (!data) {
            return null;
          }
          return data.refresh_token;
        },
      ]),
    });
  }

  async validate(req: Request, payload: any) {
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }

    const data = req?.cookies['jwt'];
    if (!data?.refresh_token) {
      throw new BadRequestException('invalid refresh token');
    }

    const user = await this.authService.validRefreshToken(
      payload.email,
      data.refresh_token,
    );

    return user;
  }
}
