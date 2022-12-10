import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { Patient } from 'src/hospital/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,

    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.reservationRepository = reservationRepository;
    this.userRepository = userRepository;
    this.hospitalRepository = hospitalRepository;
    this.patientRepository = patientRepository;
  }

  async createReservation(
    createReservationDto: CreateReservationDto,
    userId: number,
  ): Promise<any> {
    const user = await this.userRepository.find({
      where: {
        id: userId,
      },
      relations: {
        patient: true,
        hospital: true,
      },
    });

    const hospital = await this.hospitalRepository.findOneBy({
      id: user[0].hospital.id,
    });

    const isExist = await this.reservationRepository.findOneBy({
      reservationDate: createReservationDto.reservationDate,
      timetableIndex: createReservationDto.timetableIndex,
      hospital: hospital,
    });

    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already the others have reservation'],
        error: 'Forbidden',
      });
    }

    const overlapReservation = await this.reservationRepository.findOneBy({
      reservationDate: createReservationDto.reservationDate,
      user: user[0],
    });

    if (overlapReservation) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already you have reservation on this day'],
        error: 'Forbidden',
      });
    }

    const result = await this.reservationRepository
      .createQueryBuilder()
      .insert()
      .into(Reservation)
      .values({
        reservationDate: () => `'${createReservationDto.reservationDate}'`,
        timetableIndex: () => `${createReservationDto.timetableIndex}`,
        faceToface: () => `${createReservationDto.faceToface}`,
        hospital: () => `'${user[0].hospital.id}'`,
        user: () => `'${user[0].id}'`,
        patient: () => `'${user[0].patient.id}'`,
      })
      .execute();

    return result;
  }
}
