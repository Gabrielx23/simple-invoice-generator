import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContractorService } from '../Providers/contractor.service';
import { ContractorDTO } from '../DTO/contractor.dto';
import { ContractorEntity } from '../Database/Entities/contractor.entity';

@ApiTags('Contractor')
@Controller('contractors')
export class CreateContractorController {
  constructor(private readonly contractorService: ContractorService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ type: ContractorEntity })
  @ApiBadRequestResponse()
  public async create(@Body() dto: ContractorDTO): Promise<ContractorEntity> {
    const vatIdInUse = await this.contractorService.findOneByVatId(dto.vatId);
    const abbreviationInUse = await this.contractorService.findOneByAbbreviation(
      dto.abbreviation,
    );

    if (vatIdInUse || abbreviationInUse) {
      throw new BadRequestException('Vat id or abbreviation already in use!');
    }

    return this.contractorService.create(dto);
  }
}
