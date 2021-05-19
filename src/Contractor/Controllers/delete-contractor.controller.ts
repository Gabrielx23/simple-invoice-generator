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
import { ContractorService } from '../Providers/contractor.service';
import { ContractorEntity } from '../Database/Entities/contractor.entity';

@ApiTags('Contractor')
@Controller('contractors')
export class DeleteContractorController {
  constructor(private readonly contractorService: ContractorService) {}

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: ContractorEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  public async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ContractorEntity> {
    const contractor = await this.contractorService.findOneWithInvoices(id);

    if (!contractor) {
      throw new NotFoundException('Contractor not exist!');
    }

    if (contractor.invoices.length > 0) {
      throw new BadRequestException(
        'Cannot delete contractor which is assign to invoices!',
      );
    }

    return this.contractorService.delete(contractor);
  }
}
