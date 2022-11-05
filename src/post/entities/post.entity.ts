import { Hospital } from '../../hospital/entities/hospital.entity';
import { User } from '../../user/entities/user.entity';
import { Patient } from '../../hospital/entities/patient.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  video: string;

  @Column({ type: 'varchar' })
  text: string;

  @Column()
  check: boolean;

  @Column({ type: 'int' })
  stampNumber: number;

  @Column({ type: 'int' })
  cardNumber: number;

  @ManyToOne(() => Hospital, (hospital) => hospital.posts)
  hospital: Hospital;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => Patient, (patient) => patient.posts)
  patient: Patient;
}
