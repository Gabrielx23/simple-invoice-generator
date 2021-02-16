import { InvoiceEntity } from '../Entities/invoice.entity';
import { InvoiceEntityPolicy } from './invoice-entity.policy';
import { PolicyInterface } from './policy.interface';
import { BadRequestException } from '@nestjs/common';

export class CorrectInvoiceDatesPolicy
  extends InvoiceEntityPolicy
  implements PolicyInterface {
  public async isSatisfied(invoice: InvoiceEntity): Promise<void> {
    const invoiceDate = new Date(invoice.invoiceDate);
    const paymentDate = new Date(invoice.paymentDate);
    const deliveryDate = new Date(invoice.deliveryDate);

    if (invoiceDate > paymentDate || invoiceDate > deliveryDate) {
      throw new BadRequestException(
        'Invoice dates are incorrect. Invoice date must be greater than payment and delivery date.',
      );
    }
  }
}
