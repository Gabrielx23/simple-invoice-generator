import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateInvoiceDTO } from '../DTO/create-invoice.dto';
import { CreateInvoiceAction } from '../../App/Actions/create-invoice.action';
import { ContractorGateway } from '../../../Contractor/Providers/contractor.gateway';

@ApiTags('Invoice')
@Controller('invoices')
export class CreateInvoiceController {
  constructor(
    private readonly createAction: CreateInvoiceAction,
    private readonly contractorGateway: ContractorGateway,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async create(@Body() dto: CreateInvoiceDTO): Promise<void> {
    const contractor = await this.contractorGateway.getContractorById(
      dto.contractorId,
    );

    if (!contractor) {
      throw new NotFoundException('Contractor not exist!');
    }

    dto.contractor = contractor;

    await this.createAction.execute(dto);
  }
}
