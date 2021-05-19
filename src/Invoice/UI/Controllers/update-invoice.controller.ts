import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetInvoiceQuery } from '../../App/Queries/get-invoice.query';
import { UpdateInvoiceDTO } from '../DTO/update-invoice.dto';
import { UpdateInvoiceAction } from '../../App/Actions/update-invoice.action';
import { Invoice } from '../../Domain/invoice';
import { InvoiceDTO } from '../../App/DTO/invoice.dto';
import { ContractorGateway } from '../../../Contractor/Providers/contractor.gateway';
import { CompanyGateway } from '../../../Company/Providers/company.gateway';

@ApiTags('Invoice')
@Controller('invoices')
export class UpdateInvoiceController {
  constructor(
    private readonly updateInvoiceAction: UpdateInvoiceAction,
    private readonly getInvoiceQuery: GetInvoiceQuery,
    private readonly contractorGateway: ContractorGateway,
    private readonly companyGateway: CompanyGateway,
  ) {}

  @Put(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  public async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateInvoiceDTO,
  ): Promise<InvoiceDTO> {
    const invoice = await this.getInvoiceQuery.execute(id, false);

    if (!invoice) {
      throw new NotFoundException('Invoice not exist!');
    }

    const contractor = await this.contractorGateway.getContractorById(
      dto.contractorId,
    );

    if (!contractor) {
      throw new NotFoundException('Contractor not exist!');
    }

    const company = await this.companyGateway.getCompanyById(dto.companyId);

    if (!company) {
      throw new NotFoundException('Company not exist!');
    }

    dto.contractor = contractor;
    dto.company = company;

    await this.updateInvoiceAction.execute(invoice as Invoice, dto);

    return (await this.getInvoiceQuery.execute(id)) as InvoiceDTO;
  }
}
