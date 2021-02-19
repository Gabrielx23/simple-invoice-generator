import { Injectable } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { ContractorEntity } from '../Database/Entities/contractor.entity';

@Injectable()
export class ContractorGateway {
  constructor(private readonly contactorService: ContractorService) {}

  public async getContractorById(id: string): Promise<ContractorEntity> {
    return await this.contactorService.findOne(id);
  }
}
