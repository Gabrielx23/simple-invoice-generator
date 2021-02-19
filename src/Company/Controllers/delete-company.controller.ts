import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CompanyService } from '../Providers/company.service';
import { CompanyEntity } from '../Database/Entities/company.entity';

@ApiTags('Company')
@Controller('companies')
export class DeleteCompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: CompanyEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  public async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CompanyEntity> {
    const company = await this.companyService.findOneWithInvoices(id);

    if (!company) {
      throw new NotFoundException('Company not exist!');
    }

    if (company.invoices.length > 0) {
      throw new BadRequestException(
        'Cannot delete company which is assign to invoices!',
      );
    }

    return await this.companyService.delete(company);
  }
}
