import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from '../users/user.entity';

@Entity('project_invites')
@Index(['projectId', 'email'], { unique: true })
@Index(['token'], { unique: true })
export class ProjectInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @Column()
  invitedById: string;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date | null;

  @ManyToOne(() => Project, (project) => project.invites, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  invitedBy: User;
}
