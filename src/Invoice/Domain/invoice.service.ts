import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceOrmRepository } from '../Infrastructure/Database/Repositories/invoice-orm.repository';
import { Invoice } from './invoice';
import { InvoiceRowOrmRepository } from '../Infrastructure/Database/Repositories/invoice-row-orm.repository';
import { InvoiceFactory } from './invoice.factory';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';
import { InvoiceEntity } from './Entities/invoice.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceOrmRepository)
    private readonly invoiceOrmRepository: InvoiceOrmRepository,
    @InjectRepository(InvoiceRowOrmRepository)
    private readonly invoiceRowOrmRepository: InvoiceRowOrmRepository,
    private readonly invoiceFactory: InvoiceFactory,
  ) {}

  public async getInvoiceAmountThisYear(): Promise<number> {
    const currentDate = new Date();
    const startDate = new Date(`${currentDate.getFullYear()}-01-01`);
    const endDate = new Date(`${currentDate.getFullYear() + 1}-01-01`);

    return await this.invoiceOrmRepository.getInvoicesCountInTimeRange(
      startDate,
      endDate,
    );
  }

  public async get(id: string): Promise<Invoice | null> {
    const invoiceEntity = await this.invoiceOrmRepository.getById(id);

    if (!invoiceEntity) {
      return null;
    }

    return this.invoiceFactory.create(invoiceEntity, invoiceEntity.rows);
  }

  public async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<InvoiceEntity>> {
    return await this.invoiceOrmRepository.paginate(options);
  }

  public async delete(id: string): Promise<void> {
    await this.invoiceOrmRepository.delete({ id });
  }

  public async update(invoice: Invoice): Promise<void> {
    if (!invoice.isBooked()) {
      throw new BadRequestException('Invoice need to booked before save.');
    }

    const invoiceEntity = await this.invoiceOrmRepository.save(invoice.data);

    await this.invoiceRowOrmRepository.delete({ invoice: invoiceEntity });

    await this.storeRows(invoiceEntity, invoice.rows);
  }

  public async store(invoice: Invoice): Promise<void> {
    if (!invoice.isBooked()) {
      throw new BadRequestException('Invoice need to booked before save.');
    }

    const invoiceEntityPartial = this.invoiceOrmRepository.create(invoice.data);

    const invoiceEntity = await this.invoiceOrmRepository.save(
      invoiceEntityPartial,
    );

    await this.storeRows(invoiceEntity, invoice.rows);
  }

  public async storeRows(
    invoiceEntity: InvoiceEntity,
    rows: Array<Partial<InvoiceRowEntity>>,
  ): Promise<void> {
    for (const row of rows) {
      row.invoice = invoiceEntity;

      const invoiceRow = this.invoiceRowOrmRepository.create(row);

      await this.invoiceRowOrmRepository.save(invoiceRow);
    }
  }
}
