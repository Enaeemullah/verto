import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('organizations')
@Index(['ownerId', 'porOrgacodeKey'], { unique: true })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'por_orgadesc', length: 255 })
  porOrgadesc: string;

  @Column({ name: 'por_orgacode', length: 255 })
  porOrgacode: string;

  @Column({ name: 'por_orgacode_key', length: 255 })
  porOrgacodeKey: string;

  @Column({ name: 'por_active', type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  porActive: 'active' | 'inactive';

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.organizations, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
