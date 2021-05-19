import { Injectable } from '@nestjs/common';
import { InvoiceService } from '../../Domain/invoice.service';
import { InvoiceFactory } from '../../Domain/invoice.factory';
import { policyCollection } from '../../Domain/policy.collection';
import { CreateInvoiceDTO } from '../../UI/DTO/create-invoice.dto';

@Injectable()
export class CreateInvoiceAction {
  constructor(
    private readonly invoices: InvoiceService,
    private readonly factory: InvoiceFactory,
  ) {}

  public async execute(dto: CreateInvoiceDTO): Promise<void> {
    const { rows, ...data } = dto;

    const invoice = this.factory.create(data, rows);

    const invoiceAmountThisYear = await this.invoices.getInvoiceAmountThisYear();

    invoice.generateNumber(invoiceAmountThisYear);

    invoice.calculateTotal();

    await invoice.book(policyCollection);

    await this.invoices.store(invoice);
  }
}
