import { Common } from '../../entities/common.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { Ward } from './ward.entity';
import { Hospital } from './hospital.entity';

@Entity()
export class Room extends Common {
  @Column({ type: 'int' })
  roomNumber: number;

  @Column({ type: 'int' })
  limitPatient: number;

  @Column({ type: 'int' })
  currentPatient: number;

  @Column()
  icuCheck: boolean;

  @ManyToOne(() => Ward, (ward) => ward.rooms, { onDelete: 'CASCADE' })
  @JoinColumn()
  ward: Ward;

  @OneToMany(() => Patient, (patient) => patient.room)
  patients: Patient[];

  @ManyToOne(() => Hospital, (hospital) => hospital.rooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  hospital: Hospital;
}
