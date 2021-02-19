import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { CompanyService } from '../Providers/company.service';
import { CompanyEntity } from '../Database/Entities/company.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Company')
@Controller('companies')
export class PaginateCompaniesController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOkResponse({ type: [CompanyEntity] })
  @ApiQuery({ name: 'page', required: false, allowEmptyValue: true })
  @ApiQuery({ name: 'limit', required: false, allowEmptyValue: true })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  public async paginate(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<CompanyEntity>> {
    return await this.companyService.paginate({ page, limit });
  }
}
