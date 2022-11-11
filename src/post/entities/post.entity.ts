import { Hospital } from '../../hospital/entities/hospital.entity';
import { Patient } from '../../hospital/entities/patient.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Common } from '../../entities/common.entity';

@Entity()
export class Post extends Common {
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
