import { CorrectInvoiceDatesPolicy } from './correct-invoice-dates.policy';
import { InvoiceEntity } from '../Entities/invoice.entity';
import { BadRequestException } from '@nestjs/common';

const invoiceEntity = new InvoiceEntity();
invoiceEntity.invoiceDate = new Date('2021-02-02');

describe('CorrectInvoiceDatesPolicy', () => {
  let policy: CorrectInvoiceDatesPolicy;

  beforeEach(async () => {
    policy = new CorrectInvoiceDatesPolicy();
  });

  describe('isSatisfied', () => {
    it('throws exception if invoice date is greater than delivery date', async () => {
      invoiceEntity.deliveryDate = new Date('2021-02-01');
      invoiceEntity.paymentDate = new Date('2021-02-02');

      await expect(policy.isSatisfied(invoiceEntity)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws exception if invoice date is greater than payment date', async () => {
      invoiceEntity.deliveryDate = new Date('2021-02-02');
      invoiceEntity.paymentDate = new Date('2021-02-01');

      await expect(policy.isSatisfied(invoiceEntity)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
