import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Release } from './release.entity';
import { ReleasesService } from './releases.service';
import { ReleasesController } from './releases.controller';
import { ProjectsModule } from '../projects/projects.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Release]), ProjectsModule, EmailModule, UsersModule],
  providers: [ReleasesService],
  controllers: [ReleasesController],
})
export class ReleasesModule {}
