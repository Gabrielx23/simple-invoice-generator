import { InvoiceEntity } from '../Entities/invoice.entity';
import { InvoiceEntityPolicy } from './invoice-entity.policy';
import { PolicyInterface } from './policy.interface';
import { BadRequestException } from '@nestjs/common';

export class InvoiceHasCalculatedTotalPolicy
  extends InvoiceEntityPolicy
  implements PolicyInterface {
  public async isSatisfied(invoice: InvoiceEntity): Promise<void> {
    if (!invoice.total) {
      throw new BadRequestException(
        'Cannot book invoice without calculated total value.',
      );
    }
  }
}
