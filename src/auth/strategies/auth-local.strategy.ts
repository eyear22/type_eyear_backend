import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginUserDto } from '../dto/login.user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // usernaem 키 이름 변경 email로 요청
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const authUserDto: LoginUserDto = {
      email: email,
      password: password,
    };

    const user = await this.authService.validateUser(authUserDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
