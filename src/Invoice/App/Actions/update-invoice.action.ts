import { Injectable } from '@nestjs/common';
import { InvoiceService } from '../../Domain/invoice.service';
import { Invoice } from '../../Domain/invoice';
import { UpdateInvoiceDTO } from '../../UI/DTO/update-invoice.dto';
import { policyCollection } from '../../Domain/policy.collection';

@Injectable()
export class UpdateInvoiceAction {
  constructor(private readonly invoices: InvoiceService) {}

  public async execute(invoice: Invoice, dto: UpdateInvoiceDTO): Promise<void> {
    const { rows, ...data } = dto;

    invoice.data = { ...invoice.data, ...data };

    invoice.rows = rows;

    invoice.calculateTotal();

    await invoice.book(policyCollection);

    await this.invoices.update(invoice);
  }
}
