import { AggregateRoot } from '@nestjs/cqrs';
import { InvoiceEntity } from './Entities/invoice.entity';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';
import { PolicyInterface } from './Policies/policy.interface';

export class Invoice extends AggregateRoot {
  private booked = false;

  constructor(
    public data: Partial<InvoiceEntity> | InvoiceEntity,
    public rows: Array<Partial<InvoiceRowEntity>>,
  ) {
    super();
  }

  public isBooked(): boolean {
    return this.booked;
  }

  public async book(policies: Array<PolicyInterface>): Promise<void> {
    for (const policy of policies) {
      await policy.isSatisfied(this.data, this.rows);
    }

    this.booked = true;
  }

  public generateNumber(invoiceAmountThisYear: number): void {
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
      total += row.vat ? price * (1 + row.vat / 100) * row.amount : price;
    }

    this.data.total = total.toFixed(2);
  }

  public getTotalWithoutVat(): string {
    let total = 0;

    for (const row of this.rows) {
      total += parseFloat(row.price) * row.amount;
    }

    return total.toFixed(2);
  }

  public getTotalVat(): string {
    let total = 0;

    for (const row of this.rows) {
      const price = parseFloat(row.price);
      total += row.vat ? price * (row.vat / 100) * row.amount : 0;
    }

    return total.toFixed(2);
  }
}
