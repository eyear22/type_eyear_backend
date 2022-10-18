import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
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
        message: ['Already registered userId'],
        error: 'Forbidden',
      });
    }

    requestDto.password = await hash(requestDto.password, 10); // FIX ME : use env

    const { password, ...result } = await this.userRepository.save(requestDto);
    return result;
  }
}
