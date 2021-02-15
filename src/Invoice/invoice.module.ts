import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './App/Commands/Handlers';
import { queryHandlers } from './App/Queries/Handlers';

@Module({
  imports: [CqrsModule],
  providers: [...commandHandlers, ...queryHandlers],
  exports: [],
})
export class InvoiceModule {}
