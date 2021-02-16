import { AggregateRoot } from '@nestjs/cqrs';
import { InvoiceEntity } from './Entities/invoice.entity';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';

export class Invoice extends AggregateRoot {
  constructor(
    public readonly data: Partial<InvoiceEntity> | InvoiceEntity,
    public readonly rows:
      | Array<Partial<InvoiceRowEntity>>
      | Array<InvoiceRowEntity>,
  ) {
    super();
  }
}
