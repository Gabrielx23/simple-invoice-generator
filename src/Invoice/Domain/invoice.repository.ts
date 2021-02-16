import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceOrmRepository } from '../Infrastructure/Database/Repositories/invoice-orm.repository';
import { Invoice } from './invoice';
import { InvoiceRowOrmRepository } from '../Infrastructure/Database/Repositories/invoice-row-orm.repository';
import { InvoiceFactory } from './invoice.factory';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';
import { InvoiceEntity } from './Entities/invoice.entity';

@Injectable()
export class InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceOrmRepository)
    private readonly invoiceOrmRepository: InvoiceOrmRepository,
    @InjectRepository(InvoiceRowOrmRepository)
    private readonly invoiceRowOrmRepository: InvoiceRowOrmRepository,
    private readonly invoiceFactory: InvoiceFactory,
  ) {}

  public async get(id: string): Promise<Invoice | null> {
    const invoiceEntity = await this.invoiceOrmRepository.getById(id);

    if (!invoiceEntity) {
      return null;
    }

    return this.invoiceFactory.create(invoiceEntity, invoiceEntity.rows);
  }

  public async delete(invoice: Invoice): Promise<void> {
    await this.invoiceOrmRepository.delete({ id: invoice.data.id });
  }

  public async update(invoice: Invoice): Promise<void> {
    const invoiceEntity = await this.invoiceOrmRepository.save(invoice.data);

    await this.invoiceRowOrmRepository.delete({ invoice: invoiceEntity });

    await this.storeRows(invoiceEntity, invoice.rows);
  }

  public async store(invoice: Invoice): Promise<void> {
    const invoiceEntityPartial = this.invoiceOrmRepository.create(invoice.data);

    const invoiceEntity = await this.invoiceOrmRepository.save(
      invoiceEntityPartial,
    );

    await this.storeRows(invoiceEntity, invoice.rows);
  }

  public async storeRows(
    invoiceEntity: InvoiceEntity,
    rows: Array<Partial<InvoiceRowEntity>> | Array<InvoiceRowEntity>,
  ): Promise<void> {
    for (const row of rows) {
      row.invoice = invoiceEntity;

      const invoiceRow = this.invoiceRowOrmRepository.create(row);

      await this.invoiceRowOrmRepository.save(invoiceRow);
    }
  }
}
