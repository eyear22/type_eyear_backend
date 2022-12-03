import { Exclude } from 'class-transformer';
import { Post } from '../../post/entities/post.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Common } from '../../entities/common.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

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
}
