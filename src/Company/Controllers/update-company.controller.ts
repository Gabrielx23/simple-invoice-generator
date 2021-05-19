import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CompanyService } from '../Providers/company.service';
import { CompanyDTO } from '../DTO/company.dto';
import { CompanyEntity } from '../Database/Entities/company.entity';

@ApiTags('Company')
@Controller('companies')
export class UpdateCompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Put(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: CompanyEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  public async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CompanyDTO,
  ): Promise<CompanyEntity> {
    const company = await this.companyService.findOne(id);

    if (!company) {
      throw new NotFoundException('Company not exist!');
    }

    const companyByVatId = await this.companyService.findOneByVatId(dto.vatId);

    if (companyByVatId && companyByVatId.vatId !== company.vatId) {
      throw new BadRequestException('Vat id already in use!');
    }

    return this.companyService.update(company, dto);
  }
}
