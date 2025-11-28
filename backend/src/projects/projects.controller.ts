import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { CurrentUser } from '../security/user.decorator';
import type { JwtPayload } from '../security/jwt-payload.interface';
import { ProjectInvitesService } from './project-invites.service';
import { CreateProjectInviteDto } from './dto/create-project-invite.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectInvitesService: ProjectInvitesService) {}

  @Post(':client/invitations')
  inviteUser(
    @CurrentUser() user: JwtPayload,
    @Param('client') client: string,
    @Body() dto: CreateProjectInviteDto,
  ) {
    return this.projectInvitesService.createInvite(user.sub, client, dto.email);
  }
}
