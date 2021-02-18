import { Injectable } from '@nestjs/common';
import { InvoiceService } from '../../Domain/invoice.service';

@Injectable()
export class DeleteInvoiceAction {
  constructor(private readonly invoices: InvoiceService) {}

  public async execute(id: string): Promise<void> {
    await this.invoices.delete(id);
  }
}
