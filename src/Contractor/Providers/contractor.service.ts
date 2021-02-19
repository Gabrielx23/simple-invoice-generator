import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ContractorRepository } from '../Database/Repositories/contractor.repository';
import { ContractorDTO } from '../DTO/contractor.dto';
import { ContractorEntity } from '../Database/Entities/contractor.entity';

@Injectable()
export class ContractorService {
  constructor(
    @InjectRepository(ContractorRepository)
    private readonly contractors: ContractorRepository,
  ) {}

  public async create(dto: ContractorDTO): Promise<ContractorEntity> {
    const contractor = this.contractors.create(dto);
    return await this.contractors.save(contractor);
  }

  public async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<ContractorEntity>> {
    return await this.contractors.paginate(options);
  }

  public async findOne(id: string): Promise<ContractorEntity> {
    return await this.contractors.findOne({ id });
  }

  public async findOneWithInvoices(id: string): Promise<ContractorEntity> {
    return await this.contractors.findOneWithInvoices(id);
  }

  public async findOneByAbbreviation(
    abbreviation: string,
  ): Promise<ContractorEntity> {
    return await this.contractors.findOne({ abbreviation });
  }

  public async findOneByVatId(vatId: string): Promise<ContractorEntity> {
    return await this.contractors.findOne({ vatId });
  }

  public async update(
    contractor: ContractorEntity,
    data: Partial<ContractorEntity>,
  ): Promise<ContractorEntity> {
    const toUpdate = { ...contractor, ...data };

    return await this.contractors.save(toUpdate);
  }

  public async delete(contractor: ContractorEntity): Promise<ContractorEntity> {
    await this.contractors.delete({ id: contractor.id });
    return contractor;
  }
}
