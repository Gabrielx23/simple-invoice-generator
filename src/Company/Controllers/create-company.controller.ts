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
import { CompanyService } from '../Providers/company.service';
import { CompanyDTO } from '../DTO/company.dto';
import { CompanyEntity } from '../Database/Entities/company.entity';

@ApiTags('Company')
@Controller('companies')
export class CreateCompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ type: CompanyEntity })
  @ApiBadRequestResponse()
  public async create(@Body() dto: CompanyDTO): Promise<CompanyEntity> {
    const vatIdInUse = await this.companyService.findOneByVatId(dto.vatId);

    if (vatIdInUse) {
      throw new BadRequestException('Vat id already in use!');
    }

    return await this.companyService.create(dto);
  }
}
