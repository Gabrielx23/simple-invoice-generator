import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceOrmRepository } from './Infrastructure/Database/Repositories/invoice-orm.repository';
import { InvoiceRowOrmRepository } from './Infrastructure/Database/Repositories/invoice-row-orm.repository';
import { InvoiceService } from './Domain/invoice.service';
import { InvoiceFactory } from './Domain/invoice.factory';
import { actions } from './App/Actions';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([InvoiceOrmRepository, InvoiceRowOrmRepository]),
  ],
  providers: [...actions, InvoiceService, InvoiceFactory],
  exports: [...actions],
})
export class InvoiceModule {}
