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

  async getReservationList(userId: number) {
    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('reservation.id')
      .addSelect('reservation.createdAt')
      .addSelect('reservation.reservationDate')
      .addSelect('reservation.timetableIndex')
      .addSelect('reservation.faceToface')
      .addSelect('reservation.approveCheck')
      .where('reservation.user =:userId', { userId })
      .orderBy('reservation.reservationDate', 'ASC')
      .execute();

    const result = { '-1': [], '0': [], '1': [] };

    for (const reservation of reservations) {
      reservation.reservation_reservationDate = this.formatDate(
        reservation.reservation_reservationDate,
      );

      reservation.reservation_createdAt = this.formatDate(
        reservation.reservation_createdAt,
      );

      result[reservation.reservation_approveCheck].push(reservation);
    }

    return result;
  }

  formatDate(dateTypeData: Date) {
    const temp1 = dateTypeData.toISOString().split('T')[0];
    const temp2 = temp1.split('-');

    return temp2[0].substring(2) + '/' + temp2[1] + '/' + temp2[2];
  }
}
