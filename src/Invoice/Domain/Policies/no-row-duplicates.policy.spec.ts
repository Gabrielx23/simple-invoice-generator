import { BadRequestException } from '@nestjs/common';
import { NoRowDuplicatesPolicy } from './no-row-duplicates.policy';
import { InvoiceRowEntity } from '../Entities/invoice-row.entity';
import { InvoiceEntity } from '../Entities/invoice.entity';

const row1 = new InvoiceRowEntity();
row1.title = 'title 1';

const row2 = new InvoiceRowEntity();
row2.title = 'title 2';

const row3 = new InvoiceRowEntity();
row3.title = 'title 1';

describe('NoRowDuplicatesPolicy', () => {
  let policy: NoRowDuplicatesPolicy;

  beforeEach(async () => {
    policy = new NoRowDuplicatesPolicy();
  });

  describe('isSatisfied', () => {
    it('throws exception if rows array has duplicated rows by title', async () => {
      await expect(
        policy.isSatisfied(new InvoiceEntity(), [row1, row2, row3]),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
