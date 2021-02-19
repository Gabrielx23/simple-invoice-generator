import { Repository, EntityRepository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CompanyEntity } from '../Entities/company.entity';

@EntityRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {
  public async findOneWithInvoices(id: string): Promise<CompanyEntity> {
    return this.createQueryBuilder('companies')
      .leftJoinAndSelect('companies.invoices', 'companyInvoices')
      .where('companies.id = :id', { id })
      .getOne();
  }

  public async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<CompanyEntity>> {
    const query = this.createQueryBuilder('companies').orderBy(
      'companies.createdAt',
      'DESC',
    );

    return paginate<CompanyEntity>(query, options);
  }
}
