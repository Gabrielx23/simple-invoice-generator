import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CompanyRepository } from '../Database/Repositories/company.repository';
import { CompanyDTO } from '../DTO/company.dto';
import { CompanyEntity } from '../Database/Entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private readonly companies: CompanyRepository,
  ) {}

  public async create(dto: CompanyDTO): Promise<CompanyEntity> {
    const company = this.companies.create(dto);
    return this.companies.save(company);
  }

  public async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<CompanyEntity>> {
    return this.companies.paginate(options);
  }

  public async findOne(id: string): Promise<CompanyEntity> {
    return this.companies.findOne({ id });
  }

  public async findOneWithInvoices(id: string): Promise<CompanyEntity> {
    return this.companies.findOneWithInvoices(id);
  }

  public async findOneByVatId(vatId: string): Promise<CompanyEntity> {
    return this.companies.findOne({ vatId });
  }

  public async update(
    company: CompanyEntity,
    data: Partial<CompanyEntity>,
  ): Promise<CompanyEntity> {
    const toUpdate = { ...company, ...data };

    return this.companies.save(toUpdate);
  }

  public async delete(company: CompanyEntity): Promise<CompanyEntity> {
    await this.companies.delete({ id: company.id });
    return company;
  }
}
