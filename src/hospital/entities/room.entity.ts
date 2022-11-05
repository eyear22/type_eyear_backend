import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Ward } from './ward.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  roomNumber: number;

  @Column({ type: 'int' })
  limitPatient: number;

  @Column({ type: 'int' })
  currentPatient: number;

  @Column()
  icuCheck: boolean;

  @ManyToOne(() => Ward, (ward) => ward.rooms)
  ward: Ward;
}