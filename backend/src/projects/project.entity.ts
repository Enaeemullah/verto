import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Release } from '../releases/release.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectInvite } from './project-invite.entity';

@Entity('projects')
@Index(['ownerId', 'slug'], { unique: true })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

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
}
