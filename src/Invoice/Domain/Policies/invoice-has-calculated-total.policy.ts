import { InvoiceEntity } from '../Entities/invoice.entity';
import { PolicyInterface } from './policy.interface';
import { BadRequestException } from '@nestjs/common';
import { InvoiceRowEntity } from '../Entities/invoice-row.entity';

export class InvoiceHasCalculatedTotalPolicy implements PolicyInterface {
  public async isSatisfied(
    invoice: InvoiceEntity | Partial<InvoiceEntity>,
    rows: Array<Partial<InvoiceRowEntity>>,
  ): Promise<void> {
    if (!invoice.total) {
      throw new BadRequestException(
        'Cannot book invoice without calculated total value.',
      );
    }
  }
}
