import { AggregateRoot } from '@nestjs/cqrs';
import { InvoiceEntity } from './Entities/invoice.entity';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';
import { PolicyInterface } from './Policies/policy.interface';

export class Invoice extends AggregateRoot {
  constructor(
    public readonly data: Partial<InvoiceEntity> | InvoiceEntity,
    public readonly rows: Array<Partial<InvoiceRowEntity>>,
  ) {
    super();
  }

  public async book(policies: Array<PolicyInterface>): Promise<void> {
    for (const policy of policies) {
      await policy.isSatisfied(this.data, this.rows);
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

    this.data.total = total.toFixed(2);
  }

  public getTotalWithoutVat(): string {
    let total = 0;

    for (const row of this.rows) {
      total += parseFloat(row.price);
    }

    return total.toFixed(2);
  }

  public getTotalVat(): string {
    let total = 0;

    for (const row of this.rows) {
      const price = parseFloat(row.price);
      total += row.vat ? price * (row.vat / 100) : 0;
    }

    return total.toFixed(2);
  }
}
