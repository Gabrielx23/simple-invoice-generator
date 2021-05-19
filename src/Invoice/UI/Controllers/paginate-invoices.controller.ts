import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { InvoiceEntity } from '../../Domain/Entities/invoice.entity';
import { PaginateInvoicesQuery } from '../../App/Queries/paginate-invoices.query';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Invoice')
@Controller('invoices')
export class PaginateInvoicesController {
  constructor(private readonly paginateInvoiceQuery: PaginateInvoicesQuery) {}

  @Get()
  @ApiOkResponse({ type: [InvoiceEntity] })
  @ApiQuery({ name: 'page', required: false, allowEmptyValue: true })
  @ApiQuery({ name: 'limit', required: false, allowEmptyValue: true })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  public async paginate(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<InvoiceEntity>> {
    return this.paginateInvoiceQuery.execute({ page, limit });
  }
}
