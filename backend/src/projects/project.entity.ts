import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Release } from '../releases/release.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectInvite } from './project-invite.entity';
import { ProjectActivityLog } from './project-activity-log.entity';
import { TransactionEvent } from '../transaction-events/transaction-event.entity';

@Entity('projects')
@Index(['ownerId', 'slug'], { unique: true })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ name: 'por_orgadesc', nullable: true })
  porOrgadesc: string | null;

  @Column({ name: 'por_orgacode', nullable: true })
  porOrgacode: string | null;

  @Column({ name: 'por_active', default: 'active' })
  porActive: 'active' | 'inactive';

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.ownedProjects, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany(() => Release, (release) => release.project)
  releases: Release[];

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];

  @OneToMany(() => ProjectInvite, (invite) => invite.project)
  invites: ProjectInvite[];

  @OneToMany(() => ProjectActivityLog, (log) => log.project)
  activityLogs: ProjectActivityLog[];

  @OneToMany(() => TransactionEvent, (transaction) => transaction.project)
  transactionEvents: TransactionEvent[];

  @Column({ nullable: true })
  lastUpdatedById: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lastUpdatedById' })
  lastUpdatedBy: User | null;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
