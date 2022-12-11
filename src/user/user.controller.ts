import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailCheckDto } from './dto/email-check.dto';
import { UserService } from './user.service';
import { EamilCheckResponse } from './dto/email-check-response.dto';
import { CreateUserResponse } from './dto/create-user-response.dto';
import { PostsResponse } from './dto/posts-response.dto';
import { ConnectPatientDto } from './dto/connect-patient.dto';
import { ConnectPatientResponse } from './dto/connect-patient-response.dto';
import { HospitalListResponse } from './dto/hospital-list-response.dto';

@Controller('user')
@ApiTags('User API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @ApiOperation({
    summary: '유저 생성 API',
    description: '유저를 생성한다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'success',
    type: CreateUserResponse,
  })
  async getUser(@Body() requestDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.createUser(requestDto);
    const result = {
      message: 'success',
      user: user,
    };
    return res.status(HttpStatus.CREATED).send(result);
  }

  @Get('emailCheck')
  @ApiOperation({
    summary: '이메일 중복 확인 API',
    description: '이메일 중복 확인 (false: 사용 불가, true: 사용 가능)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: EamilCheckResponse,
  })
  async emailCheck(
    @Query() emailCheckDto: EmailCheckDto,
    @Res() res: Response,
  ) {
    const isValid = await this.userService.emailCheck(emailCheckDto);
    const result = {
      message: 'success',
      ...isValid,
    };
    return res.status(HttpStatus.OK).send(result);
  }

  @Get('posts')
  // @UseGuards(JwtAuthGuard) // fix: 로그인 연결 후 수정
  @ApiOperation({
    summary: '개인 보낸 우편 리스트 API',
    description: '보낸 우편 리스트 확인',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: PostsResponse,
  })
  async getPosts(@Res() res: Response) {
    const posts = await this.userService.getPosts();
    const result = {
      message: 'success',
      posts: posts,
    };
    return res.status(HttpStatus.OK).send(result);
  }

  @Post('patient')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '수신인 등록 API',
    description: '개인 수신인 등록(환자 연결) API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: ConnectPatientResponse,
  })
  async connectPatient(
    @Req() req: Request,
    @Res() res: Response,
    @Body() requestDto: ConnectPatientDto,
  ) {
    const patient = await this.userService.connectPatient(
      req.user.id,
      requestDto,
    );
    const result = {
      message: 'success',
      patient: patient,
    };
    return res.status(HttpStatus.OK).send(result);
  }

  @Get('hospitals')
  @ApiOperation({
    summary: '아이어 등록 병원 리스트 API',
    description: '아이어에 등록된 병원 리스트를 조회하는 API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: HospitalListResponse,
  })
  async getHospitalList(@Res() res: Response) {
    const hospitals = await this.userService.getHospitalList();
    const result = {
      message: 'success',
      hospitals: hospitals,
    };
    return res.status(HttpStatus.OK).send(result);
  }
}
