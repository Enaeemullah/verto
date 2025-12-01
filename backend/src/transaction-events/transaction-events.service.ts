import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TransactionEvent } from './transaction-event.entity';
import { ProjectsService } from '../projects/projects.service';
import { CreateTransactionEventDto } from './dto/create-transaction-event.dto';
import { normalizeKey } from '../shared/normalize-key';
import { TransactionEventPayload, TransactionEventsResponse } from './transaction-events.types';

@Injectable()
export class TransactionEventsService {
  constructor(
    @InjectRepository(TransactionEvent)
    private readonly transactionEventsRepository: Repository<TransactionEvent>,
    private readonly projectsService: ProjectsService,
  ) {}

  async getEventsForUser(userId: string): Promise<TransactionEventsResponse> {
    const projectIds = await this.projectsService.getAccessibleProjectIds(userId);

    if (projectIds.length === 0) {
      return {};
    }

    const events = await this.transactionEventsRepository.find({
      where: { projectId: In(projectIds) },
      relations: { project: true },
      order: { code: 'ASC' },
    });

    return events.reduce<TransactionEventsResponse>((acc, event) => {
      if (!event.project) {
        return acc;
      }

      const client = event.project.slug;
      if (!acc[client]) {
        acc[client] = [];
      }

      acc[client].push(this.mapToPayload(event));
      return acc;
    }, {});
  }

  async createTransactionEvent(userId: string, dto: CreateTransactionEventDto): Promise<TransactionEventsResponse> {
    const normalizedClient = normalizeKey(dto.client);
    const normalizedCode = normalizeKey(dto.code);

    const existing = await this.transactionEventsRepository.findOne({
      where: { codeKey: normalizedCode },
    });

    if (existing) {
      throw new ConflictException('Transaction event already exists');
    }

    const project = await this.projectsService.findAccessibleProjectBySlug(userId, normalizedClient);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const event = this.transactionEventsRepository.create({
      projectId: project.id,
      code: dto.code.trim(),
      codeKey: normalizedCode,
      description: dto.description.trim(),
    });

    await this.transactionEventsRepository.save(event);

    await this.projectsService.recordActivity(project.id, userId, 'transaction_event_created', {
      transactionId: event.id,
      code: event.code,
    });

    return this.getEventsForUser(userId);
  }

  private mapToPayload(event: TransactionEvent): TransactionEventPayload {
    return {
      id: event.id,
      client: event.project.slug,
      projectId: event.projectId,
      projectName: event.project.name,
      code: event.code,
      description: event.description,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }
}
