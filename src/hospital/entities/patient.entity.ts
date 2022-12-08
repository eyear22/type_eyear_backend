import { Post } from '../../post/entities/post.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Hospital } from './hospital.entity';
import { Room } from './room.entity';
import { Ward } from './ward.entity';
import { Common } from '../../entities/common.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Keyword } from 'src/keywords/entities/keyword.entity';

@Entity()
export class Patient extends Common {
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

  @OneToMany(() => Post, (post) => post.patient)
  posts: Post[];

  @OneToMany(() => Reservation, (reservation) => reservation.patient)
  reservations: Reservation[];

  @OneToMany(() => Keyword, (keyword) => keyword.patient)
  keywords: Keyword[];
}
