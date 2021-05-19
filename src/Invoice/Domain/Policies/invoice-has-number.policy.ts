import { InvoiceEntity } from '../Entities/invoice.entity';
import { PolicyInterface } from './policy.interface';
import { BadRequestException } from '@nestjs/common';
import { InvoiceRowEntity } from '../Entities/invoice-row.entity';

export class InvoiceHasNumberPolicy implements PolicyInterface {
  public async isSatisfied(
    invoice: InvoiceEntity | Partial<InvoiceEntity>,
    rows: Array<Partial<InvoiceRowEntity>>,
  ): Promise<void> {
    if (!invoice.number) {
      throw new BadRequestException(
        'Cannot book invoice without invoice number.',
      );
    }
  }
}
