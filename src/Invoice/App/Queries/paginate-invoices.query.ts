import { Injectable } from '@nestjs/common';
import { InvoiceService } from '../../Domain/invoice.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { InvoiceEntity } from '../../Domain/Entities/invoice.entity';

@Injectable()
export class PaginateInvoicesQuery {
  constructor(private readonly invoices: InvoiceService) {}

  public async execute(
    options: IPaginationOptions,
  ): Promise<Pagination<InvoiceEntity>> {
    return await this.invoices.paginate(options);
  }
}
