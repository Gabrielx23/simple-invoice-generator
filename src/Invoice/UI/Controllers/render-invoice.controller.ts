import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
  Render,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetInvoiceQuery } from '../../App/Queries/get-invoice.query';

@ApiTags('Invoice')
@Controller('invoices')
export class RenderInvoiceController {
  constructor(private readonly getInvoiceQuery: GetInvoiceQuery) {}

  @Get(':id/render')
  @UsePipes(ValidationPipe)
  @ApiQuery({ name: 'lang', required: false, allowEmptyValue: true })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Render('invoices/invoice')
  public async get(
    @Query('lang') lang: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const invoice = await this.getInvoiceQuery.execute(id);

    if (!invoice) {
      throw new NotFoundException('Invoice not exist!');
    }

    return { invoice, lang };
  }
}
