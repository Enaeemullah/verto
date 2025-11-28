import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { normalizeKey } from '../shared/normalize-key';
import { Project } from './project.entity';
import { ProjectMember, ProjectRole } from './project-member.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly membersRepository: Repository<ProjectMember>,
  ) {}

  async getAccessibleProjectIds(userId: string): Promise<string[]> {
    const [owned, memberships] = await Promise.all([
      this.projectsRepository.find({
        where: { ownerId: userId },
        select: { id: true },
      }),
      this.membersRepository.find({
        where: { userId },
        select: { projectId: true },
      }),
    ]);

    const ids = new Set<string>();
    owned.forEach((project) => ids.add(project.id));
    memberships.forEach((member) => ids.add(member.projectId));

    return Array.from(ids);
  }

  async findAccessibleProjectBySlug(userId: string, slug: string) {
    const normalizedSlug = normalizeKey(slug);

    const project = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoin(
        ProjectMember,
        'member',
        'member.projectId = project.id AND member.userId = :userId',
        { userId },
      )
      .where(
        '(project.ownerId = :userId OR member.userId IS NOT NULL) AND project.slug = :slug',
        { userId, slug: normalizedSlug },
      )
      .getOne();

    return project ?? null;
  }

  async findOwnedProjectBySlug(ownerId: string, slug: string) {
    return this.projectsRepository.findOne({
      where: { ownerId, slug: normalizeKey(slug) },
    });
  }

  async ensureProjectForUser(userId: string, clientName: string) {
    const slug = normalizeKey(clientName);
    const existing = await this.findAccessibleProjectBySlug(userId, slug);
    if (existing) {
      return existing;
    }

    const project = this.projectsRepository.create({
      ownerId: userId,
      slug,
      name: clientName.trim() || slug,
    });

    const saved = await this.projectsRepository.save(project);
    await this.ensureMembership(saved.id, userId, 'owner');
    return saved;
  }

  async ensureMembership(projectId: string, userId: string, role: ProjectRole = 'editor') {
    const existing = await this.membersRepository.findOne({
      where: { projectId, userId },
    });

    if (existing) {
      if (existing.role !== role) {
        existing.role = role;
        await this.membersRepository.save(existing);
      }

      return existing;
    }

    const member = this.membersRepository.create({
      projectId,
      userId,
      role,
    });

    return this.membersRepository.save(member);
  }

  async isUserInProject(projectId: string, userId: string) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      select: { ownerId: true, id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId === userId) {
      return true;
    }

    const membership = await this.membersRepository.findOne({
      where: { projectId, userId },
    });

    return Boolean(membership);
  }
}
