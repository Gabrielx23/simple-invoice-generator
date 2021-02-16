import { Repository, EntityRepository } from 'typeorm';
import { InvoiceEntity } from '../../../Domain/Entities/invoice.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(InvoiceEntity)
export class InvoiceOrmRepository extends Repository<InvoiceEntity> {
  public async invoiceAmountThisYear(): Promise<number> {
    const currentDate = new Date();
    const startDate = new Date(`${currentDate.getFullYear()}-01-01`);
    const endDate = new Date(`${currentDate.getFullYear() + 1}-01-01`);

    return this.createQueryBuilder('invoices')
      .where(
        'invoices.invoiceDate >= :startDate and invoices.invoiceDate < :endDate',
        {
          startDate,
          endDate,
        },
      )
      .getCount();
  }

  public async getById(id: string): Promise<InvoiceEntity> {
    return this.createQueryBuilder('invoices')
      .where('invoices.id = :id', { id })
      .leftJoinAndSelect('invoices.rows', 'invoiceRows')
      .getOne();
  }

  public async getAll(): Promise<Array<InvoiceEntity>> {
    return this.createQueryBuilder('invoices')
      .orderBy('invoices.createdAt', 'DESC')
      .leftJoinAndSelect('invoices.rows', 'invoiceRows')
      .getMany();
  }

  public async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<InvoiceEntity>> {
    const query = this.createQueryBuilder('invoices')
      .orderBy('invoices.createdAt', 'DESC')
      .leftJoinAndSelect('invoices.rows', 'invoiceRows');

    return paginate<InvoiceEntity>(query, options);
  }
}
