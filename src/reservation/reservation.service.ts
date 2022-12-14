import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.reservationRepository = reservationRepository;
    this.userRepository = userRepository;
  }

  async createReservation(
    createReservationDto: CreateReservationDto,
    userId: number,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        patient: true,
        hospital: true,
      },
    });

    const isExist = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.hospitalId = :hospitalId', {
        hospitalId: user.hospital.id,
      })
      .andWhere(
        'date_format(reservation.reservationDate, "%Y-%m-%d") = :reservationDate',
        { reservationDate: createReservationDto.reservationDate },
      )
      .andWhere('reservation.timetableIndex =:timetableIndex', {
        timetableIndex: createReservationDto.timetableIndex,
      })
      .andWhere('reservation.approveCheck =:approve', { approve: 1 })
      .execute();

    if (isExist.length > 0) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already the others have reservation'],
        error: 'Forbidden',
      });
    }

    const overlapReservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.hospitalId = :hospitalId', {
        hospitalId: user.hospital.id,
      })
      .andWhere(
        'date_format(reservation.reservationDate, "%Y-%m-%d") = :reservationDate',
        { reservationDate: createReservationDto.reservationDate },
      )
      .andWhere('reservation.userId =:userId', { userId })
      .execute();

    if (overlapReservation.length > 0) {
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
        hospital: () => `'${user.hospital.id}'`,
        user: () => `'${user.id}'`,
        patient: () => `'${user.patient.id}'`,
      })
      .execute();

    return { id: result.identifiers[0].id };
  }
}
