import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  hospitalId: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;
}
