import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { CurrentUser } from '../security/user.decorator';
import type { JwtPayload } from '../security/jwt-payload.interface';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.organizationsService.listOrganizations(user.sub);
  }

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrganizationDto) {
    return this.organizationsService.createOrganization(user.sub, dto);
  }
}
