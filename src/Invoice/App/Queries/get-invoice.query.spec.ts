import { Test } from '@nestjs/testing';
import { InvoiceService } from '../../Domain/invoice.service';
import { GetInvoiceQuery } from './get-invoice.query';
import { Invoice } from '../../Domain/invoice';
import { InvoiceEntity } from '../../Domain/Entities/invoice.entity';
import { InvoiceRowEntity } from '../../Domain/Entities/invoice-row.entity';
import { InvoiceDTO } from '../DTO/invoice.dto';

const invoiceServiceMock = () => ({
  get: jest.fn(),
});

const invoiceRowEntity = new InvoiceRowEntity();
invoiceRowEntity.price = '10.00';
invoiceRowEntity.vat = 23;

const invoiceEntity = new InvoiceEntity();
invoiceEntity.rows = [invoiceRowEntity];

const invoice = new Invoice(invoiceEntity, invoiceEntity.rows);

describe('GetInvoiceQuery', () => {
  let invoiceService: InvoiceService, query: GetInvoiceQuery;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: InvoiceService, useFactory: invoiceServiceMock }],
    }).compile();

    invoiceService = await module.resolve(InvoiceService);
    query = new GetInvoiceQuery(invoiceService);
  });

  describe('execute', () => {
    it('uses invoice service to obtain invoice by id', async () => {
      jest.spyOn(invoiceService, 'get').mockResolvedValue(null);

      await query.execute('id');

      expect(invoiceService.get).toHaveBeenCalledWith('id');
    });

    it('returns null if invoice by id not exist', async () => {
      jest.spyOn(invoiceService, 'get').mockResolvedValue(null);

      const result = await query.execute('id');

      expect(result).toBeNull();
    });

    it('returns not parsed invoice if parse flag is set to false', async () => {
      jest.spyOn(invoiceService, 'get').mockResolvedValue(invoice);

      const result = await query.execute('id', false);

      expect(result).toEqual(invoice);
    });

    it('returns invoice dto if invoice by id exist', async () => {
      jest.spyOn(invoiceService, 'get').mockResolvedValue(invoice);

      const result = await query.execute('id');

      const { rows, total, ...data } = invoice.data;

      const dto = new InvoiceDTO({
        data,
        rows,
        total,
        totalWithoutVat: invoice.getTotalWithoutVat(),
        totalVat: invoice.getTotalVat(),
      });

      expect(result).toEqual(dto);
    });
  });
});
