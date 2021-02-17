import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InvoiceDTO } from '../../App/DTO/invoice.dto';
import { GetInvoiceQuery } from '../../App/Queries/get-invoice.query';

@ApiTags('Invoice')
@Controller('invoices')
export class GetInvoiceController {
  constructor(private readonly getInvoiceQuery: GetInvoiceQuery) {}

  @Get(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: InvoiceDTO })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  public async get(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<InvoiceDTO | null> {
    const invoice = await this.getInvoiceQuery.execute(id);

    if (!invoice) {
      throw new NotFoundException('Invoice not exist!');
    }

    return invoice;
  }
}
