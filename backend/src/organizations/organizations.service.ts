import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { normalizeKey } from '../shared/normalize-key';

export interface OrganizationDto {
  id: string;
  por_orgadesc: string;
  por_orgacode: string;
  por_active: 'active' | 'inactive';
}

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
  ) {}

  async listOrganizations(ownerId: string): Promise<OrganizationDto[]> {
    const organizations = await this.organizationsRepository.find({
      where: { ownerId },
      order: { porOrgadesc: 'ASC' },
    });

    return organizations.map((organization) => this.toDto(organization));
  }

  async createOrganization(ownerId: string, dto: CreateOrganizationDto): Promise<OrganizationDto> {
    const normalizedCode = normalizeKey(dto.por_orgacode);
    const existing = await this.organizationsRepository.findOne({
      where: { ownerId, porOrgacodeKey: normalizedCode },
    });

    if (existing) {
      throw new BadRequestException('Organization already exists.');
    }

    const organization = this.organizationsRepository.create({
      ownerId,
      porOrgadesc: dto.por_orgadesc.trim(),
      porOrgacode: dto.por_orgacode.trim(),
      porOrgacodeKey: normalizedCode,
      porActive: dto.por_active,
    });

    const saved = await this.organizationsRepository.save(organization);
    return this.toDto(saved);
  }

  private toDto(organization: Organization): OrganizationDto {
    return {
      id: organization.id,
      por_orgadesc: organization.porOrgadesc,
      por_orgacode: organization.porOrgacode,
      por_active: organization.porActive,
    };
  }
}
