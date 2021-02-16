import { AggregateRoot } from '@nestjs/cqrs';
import { InvoiceEntity } from './Entities/invoice.entity';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';
import { PolicyInterface } from './Policies/policy.interface';
import { InvoiceEntityPolicy } from './Policies/invoice-entity.policy';
import { InvoiceRowsPolicy } from './Policies/invoice-rows.policy';
import { BadRequestException } from '@nestjs/common';

export class Invoice extends AggregateRoot {
  constructor(
    public readonly data: Partial<InvoiceEntity> | InvoiceEntity,
    public readonly rows:
      | Array<Partial<InvoiceRowEntity>>
      | Array<InvoiceRowEntity>,
  ) {
    super();
  }

  public async book(policies: Array<PolicyInterface>): Promise<void> {
    for (const policy of policies) {
      if (policy instanceof InvoiceEntityPolicy) {
        await policy.isSatisfied(this.data);
        continue;
      }

      if (policy instanceof InvoiceRowsPolicy) {
        await policy.isSatisfied(this.rows);
        continue;
      }

      throw new BadRequestException('One of policies is not supported');
    }
  }

  public generateNumber(invoiceAmountThisYear: number): Promise<void> {
    if (this.data.number) {
      return;
    }

    const currentDate = new Date();

    this.data.number = `${
      invoiceAmountThisYear + 1
    }/${currentDate.getFullYear()}`;
  }

  public calculateTotal(): void {
    let total = 0;

    for (const row of this.rows) {
      const price = parseFloat(row.price);
      total += row.vat ? price * (1 + row.vat / 100) : price;
    }

    this.data.total = `${total}`;
  }

  public getTotalWithoutVat(): number {
    let total = 0;

    for (const row of this.rows) {
      total += parseFloat(row.price);
    }

    return total;
  }

  public getTotalVat(): number {
    let total = 0;

    for (const row of this.rows) {
      const price = parseFloat(row.price);
      total += row.vat ? price * (row.vat / 100) : 0;
    }

    return total;
  }
}
