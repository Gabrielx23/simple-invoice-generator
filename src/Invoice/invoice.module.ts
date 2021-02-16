import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceOrmRepository } from './Infrastructure/Database/Repositories/invoice-orm.repository';
import { InvoiceRowOrmRepository } from './Infrastructure/Database/Repositories/invoice-row-orm.repository';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([InvoiceOrmRepository, InvoiceRowOrmRepository]),
  ],
  providers: [],
  exports: [],
})
export class InvoiceModule {}
