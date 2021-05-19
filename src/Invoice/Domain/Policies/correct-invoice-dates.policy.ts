import { InvoiceEntity } from '../Entities/invoice.entity';
import { PolicyInterface } from './policy.interface';
import { BadRequestException } from '@nestjs/common';
import { InvoiceRowEntity } from '../Entities/invoice-row.entity';

export class CorrectInvoiceDatesPolicy implements PolicyInterface {
  public async isSatisfied(
    invoice: InvoiceEntity | Partial<InvoiceEntity>,
    rows: Array<Partial<InvoiceRowEntity>>,
  ): Promise<void> {
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
