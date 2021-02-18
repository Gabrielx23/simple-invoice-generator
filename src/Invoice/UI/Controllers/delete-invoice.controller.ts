import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Delete,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DeleteInvoiceAction } from '../../App/Actions/delete-invoice.action';
import { GetInvoiceQuery } from '../../App/Queries/get-invoice.query';

@ApiTags('Invoice')
@Controller('invoices')
export class DeleteInvoiceController {
  constructor(
    private readonly deleteInvoiceAction: DeleteInvoiceAction,
    private readonly getInvoiceQuery: GetInvoiceQuery,
  ) {}

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  public async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    const invoice = await this.getInvoiceQuery.execute(id);

    if (!invoice) {
      throw new NotFoundException('Invoice not exist!');
    }

    await this.deleteInvoiceAction.execute(invoice.data.id);
  }
}
