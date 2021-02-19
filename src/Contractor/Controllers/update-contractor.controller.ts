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
import { ContractorService } from '../Providers/contractor.service';
import { ContractorDTO } from '../DTO/contractor.dto';
import { ContractorEntity } from '../Database/Entities/contractor.entity';

@ApiTags('Contractor')
@Controller('contractors')
export class UpdateContractorController {
  constructor(private readonly contractorService: ContractorService) {}

  @Put(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: ContractorEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  public async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ContractorDTO,
  ): Promise<ContractorEntity> {
    const contractor = await this.contractorService.findOne(id);

    if (!contractor) {
      throw new NotFoundException('Contractor not exist!');
    }

    const contractorByVatId = await this.contractorService.findOneByVatId(
      dto.vatId,
    );

    const contractorByAbbreviation = await this.contractorService.findOneByAbbreviation(
      dto.abbreviation,
    );

    if (
      (contractorByVatId && contractorByVatId.vatId !== contractor.vatId) ||
      (contractorByAbbreviation &&
        contractorByAbbreviation.abbreviation !== contractor.abbreviation)
    ) {
      throw new BadRequestException('Vat id or abbreviation already in use!');
    }

    return await this.contractorService.update(contractor, dto);
  }
}
