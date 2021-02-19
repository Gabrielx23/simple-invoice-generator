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
import { ContractorService } from '../Providers/contractor.service';
import { ContractorEntity } from '../Database/Entities/contractor.entity';

@ApiTags('Contractor')
@Controller('contractors')
export class GetContractorController {
  constructor(private readonly contractorService: ContractorService) {}

  @Get(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: ContractorEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  public async get(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ContractorEntity> {
    const contractor = await this.contractorService.findOne(id);

    if (!contractor) {
      throw new NotFoundException('Contractor not exist!');
    }

    return contractor;
  }
}
