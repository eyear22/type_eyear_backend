import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailCheckDto } from './dto/email-check.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.userRepository = userRepository;
  }

  async createUser(requestDto: CreateUserDto): Promise<any> {
    const isExist = await this.userRepository.findOneBy({
      email: requestDto.email,
    });

    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already registered email'],
        error: 'Forbidden',
      });
    }

    requestDto.password = await hash(requestDto.password, 10); // FIX ME : use env

    const { password, ...result } = await this.userRepository.save(requestDto);
    return result;
  }

  async emailCheck(emailCheckDto: EmailCheckDto) {
    if (!emailCheckDto.email) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Invalid value'],
        error: 'Bad Request',
      });
    }

    const isExist = await this.userRepository.findOneBy({
      email: emailCheckDto.email,
    });

    const result = {};
    if (isExist) {
      result['isValidEmail'] = false;
    } else {
      result['isValidEmail'] = true;
    }
    return result;
  }
}
