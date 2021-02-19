import { Repository, EntityRepository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ContractorEntity } from '../Entities/contractor.entity';

@EntityRepository(ContractorEntity)
export class ContractorRepository extends Repository<ContractorEntity> {
  public async findOneWithInvoices(id: string): Promise<ContractorEntity> {
    return this.createQueryBuilder('contractors')
      .leftJoinAndSelect('contractors.invoices', 'contractorInvoices')
      .where('contractors.id = :id', { id })
      .getOne();
  }

  public async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<ContractorEntity>> {
    const query = this.createQueryBuilder('contractors').orderBy(
      'contractors.createdAt',
      'DESC',
    );

    return paginate<ContractorEntity>(query, options);
  }
}
