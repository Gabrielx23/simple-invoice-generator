import { Test } from '@nestjs/testing';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceFactory } from './invoice.factory';
import { InvoiceOrmRepository } from '../Infrastructure/Database/Repositories/invoice-orm.repository';
import { InvoiceRowOrmRepository } from '../Infrastructure/Database/Repositories/invoice-row-orm.repository';
import { InvoiceEntity } from './Entities/invoice.entity';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';
import { Invoice } from './invoice';

const invoiceOrmRepositoryMock = () => ({
  getById: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
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

describe('InvoiceRepository', () => {
  let invoiceRepository: InvoiceRepository,
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
    invoiceRepository = new InvoiceRepository(
      invoiceOrmRepository,
      invoiceRowOrmRepository,
      invoiceFactory,
    );
  });

  describe('get', () => {
    it('uses invoice orm repository to obtain invoice entity by id', async () => {
      await invoiceRepository.get('id');

      expect(invoiceOrmRepository.getById).toHaveBeenCalledWith('id');
    });

    it('returns null if invoice not exist by id', async () => {
      jest.spyOn(invoiceOrmRepository, 'getById').mockResolvedValue(undefined);

      const result = await invoiceRepository.get('id');

      expect(result).toEqual(null);
    });

    it('uses invoice factory to create new invoice instance', async () => {
      jest
        .spyOn(invoiceOrmRepository, 'getById')
        .mockResolvedValue(invoiceEntity);

      await invoiceRepository.get('id');

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

      const result = await invoiceRepository.get('id');

      expect(result).toEqual(invoice);
    });
  });

  describe('store', () => {
    it('uses invoice orm repository to create entity partial', async () => {
      await invoiceRepository.store(invoice);

      expect(invoiceOrmRepository.create).toBeCalledWith(invoiceEntity);
    });

    it('uses invoice orm repository to save invoice partial', async () => {
      jest.spyOn(invoiceOrmRepository, 'create').mockReturnValue(invoiceEntity);

      await invoiceRepository.store(invoice);

      expect(invoiceOrmRepository.save).toHaveBeenCalledWith(invoiceEntity);
    });

    it('creates and saves all invoice rows', async () => {
      invoiceRowEntity.invoice = invoiceEntity;

      jest
        .spyOn(invoiceRowOrmRepository, 'create')
        .mockReturnValue(invoiceRowEntity);

      await invoiceRepository.store(invoice);

      expect(invoiceRowOrmRepository.create).toBeCalledWith(invoiceRowEntity);
      expect(invoiceRowOrmRepository.save).toHaveBeenCalledWith(
        invoiceRowEntity,
      );
    });
  });

  describe('update', () => {
    it('uses invoice orm repository to save invoice partial', async () => {
      await invoiceRepository.update(invoice);

      expect(invoiceOrmRepository.save).toHaveBeenCalledWith(invoiceEntity);
    });

    it('deletes old invoice rows', async () => {
      jest.spyOn(invoiceOrmRepository, 'save').mockResolvedValue(invoiceEntity);

      await invoiceRepository.update(invoice);

      expect(invoiceRowOrmRepository.delete).toHaveBeenCalledWith({
        invoice: invoiceEntity,
      });
    });

    it('creates and saves all invoice rows', async () => {
      invoiceRowEntity.invoice = invoiceEntity;

      jest
        .spyOn(invoiceRowOrmRepository, 'create')
        .mockReturnValue(invoiceRowEntity);

      await invoiceRepository.update(invoice);

      expect(invoiceRowOrmRepository.create).toBeCalledWith(invoiceRowEntity);
      expect(invoiceRowOrmRepository.save).toHaveBeenCalledWith(
        invoiceRowEntity,
      );
    });
  });

  describe('delete', () => {
    it('uses invoice orm repository to delete given invoice entity', async () => {
      await invoiceRepository.delete(invoice);

      expect(invoiceOrmRepository.delete).toHaveBeenCalledWith({
        id: invoiceEntity.id,
      });
    });
  });
});
