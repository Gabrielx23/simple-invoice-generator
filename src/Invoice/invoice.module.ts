import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceOrmRepository } from './Infrastructure/Database/Repositories/invoice-orm.repository';
import { InvoiceRowOrmRepository } from './Infrastructure/Database/Repositories/invoice-row-orm.repository';
import { InvoiceService } from './Domain/invoice.service';
import { InvoiceFactory } from './Domain/invoice.factory';
import { actions } from './App/Actions';
import { controllers } from './UI/Controllers';
import { queries } from './App/Queries';
import { ContractorModule } from '../Contractor/contractor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceOrmRepository, InvoiceRowOrmRepository]),
    ContractorModule,
  ],
  providers: [...actions, ...queries, InvoiceService, InvoiceFactory],
  exports: [],
  controllers: [...controllers],
})
export class InvoiceModule {}
