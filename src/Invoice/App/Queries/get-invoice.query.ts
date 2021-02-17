import { Injectable } from '@nestjs/common';
import { InvoiceService } from '../../Domain/invoice.service';
import { InvoiceDTO } from '../DTO/invoice.dto';

@Injectable()
export class GetInvoiceQuery {
  constructor(private readonly invoices: InvoiceService) {}

  public async execute(id: string): Promise<InvoiceDTO | null> {
    const invoice = await this.invoices.get(id);

    if (!invoice) {
      return null;
    }

    const { rows, total, ...data } = invoice.data;

    return new InvoiceDTO({
      data,
      rows,
      total,
      totalWithoutVat: invoice.getTotalWithoutVat(),
      totalVat: invoice.getTotalVat(),
    });
  }
}
