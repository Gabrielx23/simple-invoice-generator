import { InvoiceRowEntity } from '../Entities/invoice-row.entity';
import { PolicyInterface } from './policy.interface';
import { BadRequestException } from '@nestjs/common';
import { InvoiceEntity } from '../Entities/invoice.entity';

export class NoRowDuplicatesPolicy implements PolicyInterface {
  public async isSatisfied(
    invoice: InvoiceEntity | Partial<InvoiceEntity>,
    rows: Array<Partial<InvoiceRowEntity>>,
  ): Promise<void> {
    rows
      .map((row: Partial<InvoiceRowEntity>) => row.title)
      .reduce((values: Array<string>, value: string) => {
        if (!values.includes(value)) {
          values.push(value);
          return values;
        }

        throw new BadRequestException('Row duplications found.');
      }, []);
  }
}
