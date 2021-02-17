import { Test } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { InvoiceFactory } from './invoice.factory';
import { InvoiceOrmRepository } from '../Infrastructure/Database/Repositories/invoice-orm.repository';
import { InvoiceRowOrmRepository } from '../Infrastructure/Database/Repositories/invoice-row-orm.repository';
import { InvoiceEntity } from './Entities/invoice.entity';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';
import { Invoice } from './invoice';
import { BadRequestException } from '@nestjs/common';

const invoiceOrmRepositoryMock = () => ({
  getById: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  getInvoicesCountInTimeRange: jest.fn(),
});

const invoiceRowOrmRepositoryMock = () => ({
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const invoiceFactoryMock = () => ({
  create: jest.fn(),
});

const invoiceRowEntity = new InvoiceRowEntity();

const invoiceEntity = new InvoiceEntity();
invoiceEntity.rows = [invoiceRowEntity];

const invoice = new Invoice(invoiceEntity, invoiceEntity.rows);

describe('InvoiceService', () => {
  let invoiceService: InvoiceService,
    invoiceFactory: InvoiceFactory,
    invoiceOrmRepository: InvoiceOrmRepository,
    invoiceRowOrmRepository: InvoiceRowOrmRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: InvoiceFactory, useFactory: invoiceFactoryMock },
        { provide: InvoiceOrmRepository, useFactory: invoiceOrmRepositoryMock },
        {
          provide: InvoiceRowOrmRepository,
          useFactory: invoiceRowOrmRepositoryMock,
        },
      ],
    }).compile();

    invoiceFactory = await module.resolve(InvoiceFactory);
    invoiceOrmRepository = await module.get(InvoiceOrmRepository);
    invoiceRowOrmRepository = await module.get(InvoiceRowOrmRepository);
    invoiceService = new InvoiceService(
      invoiceOrmRepository,
      invoiceRowOrmRepository,
      invoiceFactory,
    );

    await invoice.book([]);
  });

  describe('getInvoiceAmountThisYear', () => {
    it('uses invoice orm repository to obtain invoices from current year', async () => {
      const currentDate = new Date();
      const startDate = new Date(`${currentDate.getFullYear()}-01-01`);
      const endDate = new Date(`${currentDate.getFullYear() + 1}-01-01`);

      await invoiceService.getInvoiceAmountThisYear();

      expect(
        invoiceOrmRepository.getInvoicesCountInTimeRange,
      ).toHaveBeenCalledWith(startDate, endDate);
    });

    it('returns count of invoices from current year', async () => {
      jest
        .spyOn(invoiceOrmRepository, 'getInvoicesCountInTimeRange')
        .mockResolvedValue(10);

      const result = await invoiceService.getInvoiceAmountThisYear();

      expect(result).toEqual(10);
    });
  });

  describe('get', () => {
    it('uses invoice orm repository to obtain invoice entity by id', async () => {
      await invoiceService.get('id');

      expect(invoiceOrmRepository.getById).toHaveBeenCalledWith('id');
    });

    it('returns null if invoice not exist by id', async () => {
      jest.spyOn(invoiceOrmRepository, 'getById').mockResolvedValue(undefined);

      const result = await invoiceService.get('id');

      expect(result).toEqual(null);
    });

    it('uses invoice factory to create new invoice instance', async () => {
      jest
        .spyOn(invoiceOrmRepository, 'getById')
        .mockResolvedValue(invoiceEntity);

      await invoiceService.get('id');

      expect(invoiceFactory.create).toBeCalledWith(
        invoiceEntity,
        invoiceEntity.rows,
      );
    });

    it('returns invoice instance if invoice entity exist by id', async () => {
      jest
        .spyOn(invoiceOrmRepository, 'getById')
        .mockResolvedValue(invoiceEntity);

      jest.spyOn(invoiceFactory, 'create').mockReturnValue(invoice);

      const result = await invoiceService.get('id');

      expect(result).toEqual(invoice);
    });
  });

  describe('store', () => {
    it('throws exception if invoice is not booked', async () => {
      await expect(
        invoiceService.store(new Invoice(invoiceEntity, invoiceEntity.rows)),
      ).rejects.toThrow(BadRequestException);
    });

    it('uses invoice orm repository to create entity partial', async () => {
      await invoiceService.store(invoice);

      expect(invoiceOrmRepository.create).toBeCalledWith(invoiceEntity);
    });

    it('uses invoice orm repository to save invoice partial', async () => {
      jest.spyOn(invoiceOrmRepository, 'create').mockReturnValue(invoiceEntity);

      await invoiceService.store(invoice);

      expect(invoiceOrmRepository.save).toHaveBeenCalledWith(invoiceEntity);
    });

    it('creates and saves all invoice rows', async () => {
      invoiceRowEntity.invoice = invoiceEntity;

      jest
        .spyOn(invoiceRowOrmRepository, 'create')
        .mockReturnValue(invoiceRowEntity);

      await invoiceService.store(invoice);

      expect(invoiceRowOrmRepository.create).toBeCalledWith(invoiceRowEntity);
      expect(invoiceRowOrmRepository.save).toHaveBeenCalledWith(
        invoiceRowEntity,
      );
    });
  });

  describe('update', () => {
    it('throws exception if invoice is not booked', async () => {
      await expect(
        invoiceService.store(new Invoice(invoiceEntity, invoiceEntity.rows)),
      ).rejects.toThrow(BadRequestException);
    });

    it('uses invoice orm repository to save invoice partial', async () => {
      await invoiceService.update(invoice);

      expect(invoiceOrmRepository.save).toHaveBeenCalledWith(invoiceEntity);
    });

    it('deletes old invoice rows', async () => {
      jest.spyOn(invoiceOrmRepository, 'save').mockResolvedValue(invoiceEntity);

      await invoiceService.update(invoice);

      expect(invoiceRowOrmRepository.delete).toHaveBeenCalledWith({
        invoice: invoiceEntity,
      });
    });

    it('creates and saves all invoice rows', async () => {
      invoiceRowEntity.invoice = invoiceEntity;

      jest
        .spyOn(invoiceRowOrmRepository, 'create')
        .mockReturnValue(invoiceRowEntity);

      await invoiceService.update(invoice);

      expect(invoiceRowOrmRepository.create).toBeCalledWith(invoiceRowEntity);
      expect(invoiceRowOrmRepository.save).toHaveBeenCalledWith(
        invoiceRowEntity,
      );
    });
  });

  describe('delete', () => {
    it('uses invoice orm repository to delete given invoice entity', async () => {
      await invoiceService.delete(invoice);

      expect(invoiceOrmRepository.delete).toHaveBeenCalledWith({
        id: invoiceEntity.id,
      });
    });
  });
});
