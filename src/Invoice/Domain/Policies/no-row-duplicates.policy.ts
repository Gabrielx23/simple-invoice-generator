import { InvoiceRowEntity } from '../Entities/invoice-row.entity';
import { InvoiceRowsPolicy } from './invoice-rows.policy';
import { PolicyInterface } from './policy.interface';
import { BadRequestException } from '@nestjs/common';

export class NoRowDuplicatesPolicy
  extends InvoiceRowsPolicy
  implements PolicyInterface {
  public async isSatisfied(rows: Array<InvoiceRowEntity>): Promise<void> {
    rows
      .map((row: InvoiceRowEntity) => row.title)
      .reduce((values: Array<string>, value: string) => {
        if (!values.includes(value)) {
          values.push(value);
          return values;
        }

        throw new BadRequestException('Row duplications found.');
      }, []);
  }
}
