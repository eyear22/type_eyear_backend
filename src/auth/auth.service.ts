import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login.user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Unregistered user'],
        error: 'Forbidden',
      });
    }
    console.log(user);
    console.log(password, user.password);
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Wrong password'],
        error: 'Forbidden',
      });
    }
  }

  async login(user: any) {
    const tokens = await this.getTokens(user.id, user.email);
    const data = {
      tokens: tokens,
      user: {
        name: user.name,
      },
    };
    await this.updateRtHash(user.id, tokens.refresh_token);
    return data;
  }

  async updateRtHash(userId: number, refresh_token: string) {
    const hash = await this.hashData(refresh_token);
    await this.userRepository.update(
      { id: userId },
      { currentHashedRefreshToken: hash },
    );
  }

  async refreshToken(user: any) {
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId, email },
        {
          expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        },
      ),
      this.jwtService.signAsync(
        { id: userId, email },
        {
          expiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async validRefreshToken(email: string, refresh_token: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });
    if (!user || !user.currentHashedRefreshToken)
      throw new ForbiddenException('Invalid credentials');
    const rtMatches = bcrypt.compare(
      refresh_token,
      user.currentHashedRefreshToken,
    );
    if (!rtMatches) throw new ForbiddenException('Invalid credentials');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return user;
  }
}
