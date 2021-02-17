import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateInvoiceDTO } from '../DTO/create-invoice.dto';
import { CreateInvoiceAction } from '../../App/Actions/create-invoice.action';

@ApiTags('Invoice')
@Controller('invoices')
export class CreateInvoiceController {
  constructor(private readonly createAction: CreateInvoiceAction) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async create(@Body() dto: CreateInvoiceDTO): Promise<void> {
    await this.createAction.execute(dto);
  }
}
