import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './App/Commands/Handlers';
import { queryHandlers } from './App/Queries/Handlers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceOrmRepository } from './Infrastructure/Database/Repositories/invoice-orm.repository';
import { InvoiceRowOrmRepository } from './Infrastructure/Database/Repositories/invoice-row-orm.repository';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([InvoiceOrmRepository, InvoiceRowOrmRepository]),
  ],
  providers: [...commandHandlers, ...queryHandlers],
  exports: [],
})
export class InvoiceModule {}
