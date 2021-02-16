import { InvoiceEntity } from '../Entities/invoice.entity';
import { BadRequestException } from '@nestjs/common';
import { InvoiceHasCalculatedTotalPolicy } from './invoice-has-calculated-total.policy';

const invoiceEntity = new InvoiceEntity();

describe('InvoiceHasCalculatedTotalPolicy', () => {
  let policy: InvoiceHasCalculatedTotalPolicy;

  beforeEach(async () => {
    policy = new InvoiceHasCalculatedTotalPolicy();
  });

  describe('isSatisfied', () => {
    it('throws exception if invoice total property is not set', async () => {
      await expect(policy.isSatisfied(invoiceEntity)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
