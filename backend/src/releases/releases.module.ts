import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Release } from './release.entity';
import { ReleasesService } from './releases.service';
import { ReleasesController } from './releases.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([Release]), ProjectsModule],
  providers: [ReleasesService],
  controllers: [ReleasesController],
})
export class ReleasesModule {}
