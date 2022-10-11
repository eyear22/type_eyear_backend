import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const result = await this.userRepository.save(requestDto);
    console.log(result);
    return result;
  }
}
