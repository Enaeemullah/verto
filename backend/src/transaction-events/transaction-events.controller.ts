import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TransactionEventsService } from './transaction-events.service';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { CurrentUser } from '../security/user.decorator';
import { JwtPayload } from '../security/jwt-payload.interface';
import { CreateTransactionEventDto } from './dto/create-transaction-event.dto';

@Controller('transaction-events')
@UseGuards(JwtAuthGuard)
export class TransactionEventsController {
  constructor(private readonly transactionEventsService: TransactionEventsService) {}

  @Get()
  getTransactionEvents(@CurrentUser() user: JwtPayload) {
    return this.transactionEventsService.getEventsForUser(user.sub);
  }

  @Post()
  createTransactionEvent(@CurrentUser() user: JwtPayload, @Body() dto: CreateTransactionEventDto) {
    return this.transactionEventsService.createTransactionEvent(user.sub, dto);
  }
}
