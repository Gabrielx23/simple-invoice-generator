import { InvoiceEntity } from '../Entities/invoice.entity';
import { BadRequestException } from '@nestjs/common';
import { InvoiceHasNumberPolicy } from './invoice-has-number.policy';

const invoiceEntity = new InvoiceEntity();

describe('InvoiceHasNumberPolicy', () => {
  let policy: InvoiceHasNumberPolicy;

  beforeEach(async () => {
    policy = new InvoiceHasNumberPolicy();
  });

  describe('isSatisfied', () => {
    it('throws exception if invoice number is not set', async () => {
      await expect(policy.isSatisfied(invoiceEntity)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
