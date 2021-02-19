import { Repository, EntityRepository } from 'typeorm';
import { InvoiceEntity } from '../../../Domain/Entities/invoice.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(InvoiceEntity)
export class InvoiceOrmRepository extends Repository<InvoiceEntity> {
  public async getInvoicesCountInTimeRange(
    start: Date,
    end: Date,
  ): Promise<number> {
    return this.createQueryBuilder('invoices')
      .where('invoices.invoiceDate >= :start and invoices.invoiceDate < :end', {
        start,
        end,
      })
      .getCount();
  }

  public async getById(id: string): Promise<InvoiceEntity> {
    return this.createQueryBuilder('invoices')
      .where('invoices.id = :id', { id })
      .leftJoinAndSelect('invoices.rows', 'invoiceRows')
      .leftJoinAndSelect('invoices.contractor', 'contractor')
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
    const query = this.createQueryBuilder('invoices').orderBy(
      'invoices.createdAt',
      'DESC',
    );

    return paginate<InvoiceEntity>(query, options);
  }
}
