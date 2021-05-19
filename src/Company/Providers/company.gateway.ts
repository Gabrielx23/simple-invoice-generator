import { Injectable } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyEntity } from '../Database/Entities/company.entity';

@Injectable()
export class CompanyGateway {
  constructor(private readonly companyService: CompanyService) {}

  public async getCompanyById(id: string): Promise<CompanyEntity> {
    return this.companyService.findOne(id);
  }
}
