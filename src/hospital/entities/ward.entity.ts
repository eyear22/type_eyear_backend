import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Hospital } from './hospital.entity';

@Entity()
export class Ward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.wards)
  hospital: Hospital;
}
