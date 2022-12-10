import { User } from '../../user/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Common } from '../../entities/common.entity';

@Entity()
export class NameWord extends Common {
  @Column({ type: 'varchar' })
  word: string;

  @ManyToOne(() => User, (user) => user.nameWords)
  user: User;
}
