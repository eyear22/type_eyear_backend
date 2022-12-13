import { Patient } from '../../hospital/entities/patient.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Common } from '../../entities/common.entity';

@Entity()
export class Keyword extends Common {
  @Column({ type: 'varchar' })
  word: string;

  @Column({ type: 'double' })
  rank: number;

  @ManyToOne(() => User, (user) => user.keywords, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Patient, (patient) => patient.keywords, {
    onDelete: 'CASCADE',
  })
  patient: Patient;
}
