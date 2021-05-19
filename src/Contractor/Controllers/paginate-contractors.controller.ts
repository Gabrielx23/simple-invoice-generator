import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { ContractorService } from '../Providers/contractor.service';
import { ContractorEntity } from '../Database/Entities/contractor.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Contractor')
@Controller('contractors')
export class PaginateContractorsController {
  constructor(private readonly contractorService: ContractorService) {}

  @Get()
  @ApiOkResponse({ type: [ContractorEntity] })
  @ApiQuery({ name: 'page', required: false, allowEmptyValue: true })
  @ApiQuery({ name: 'limit', required: false, allowEmptyValue: true })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  public async paginate(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<ContractorEntity>> {
    return this.contractorService.paginate({ page, limit });
  }
}
