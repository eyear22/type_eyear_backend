import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Hospital } from './hospital.entity';
import { Room } from './room.entity';
import { Ward } from './ward.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  patNumber: string;

  @Column()
  birth: Date;

  @Column()
  inDate: Date;

  @Column({ type: 'varchar' })
  infoNumber: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.patients)
  hospital: Hospital;

  @ManyToOne(() => Ward, (ward) => ward.patients)
  ward: Ward;

  @ManyToOne(() => Room, (room) => room.patients)
  room: Room;
}
