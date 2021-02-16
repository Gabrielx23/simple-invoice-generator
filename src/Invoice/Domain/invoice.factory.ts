import { Injectable } from '@nestjs/common';
import { InvoiceEntity } from './Entities/invoice.entity';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';
import { Invoice } from './invoice';

@Injectable()
export class InvoiceFactory {
  public create(
    invoiceEntity: InvoiceEntity | Partial<InvoiceEntity>,
    rows: Array<InvoiceRowEntity> | Array<Partial<InvoiceRowEntity>>,
  ) {
    return new Invoice(invoiceEntity, rows);
  }
}
