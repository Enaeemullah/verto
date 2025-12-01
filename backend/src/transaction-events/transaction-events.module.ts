import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEvent } from './transaction-event.entity';
import { TransactionEventsService } from './transaction-events.service';
import { TransactionEventsController } from './transaction-events.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEvent]), ProjectsModule],
  providers: [TransactionEventsService],
  controllers: [TransactionEventsController],
})
export class TransactionEventsModule {}
