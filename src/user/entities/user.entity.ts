import { Exclude } from 'class-transformer';
import { Post } from '../../post/entities/post.entity';
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Common } from '../../entities/common.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Patient } from 'src/hospital/entities/patient.entity';
import { Hospital } from 'src/hospital/entities/hospital.entity';
import { Keyword } from 'src/keywords/entities/keyword.entity';

@Entity()
export class User extends Common {
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  phoneNumber: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @OneToOne(() => Patient)
  @JoinColumn()
  patient: Patient;

  @ManyToOne(() => Hospital, (hospital) => hospital.users)
  hospital: Hospital;

  @OneToMany(() => Keyword, (keyword) => keyword.user)
  keywords: Keyword[];
}
