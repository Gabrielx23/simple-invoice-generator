import {
  ApiBadRequestResponse,
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
import { CompanyService } from '../Providers/company.service';
import { CompanyEntity } from '../Database/Entities/company.entity';

@ApiTags('Company')
@Controller('companies')
export class GetCompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: CompanyEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  public async get(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CompanyEntity> {
    const company = await this.companyService.findOne(id);

    if (!company) {
      throw new NotFoundException('Company not exist!');
    }

    return company;
  }
}
