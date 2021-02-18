import { Test } from '@nestjs/testing';
import { InvoiceService } from '../../Domain/invoice.service';
import { PaginateInvoicesQuery } from './paginate-invoices.query';
import { Pagination } from 'nestjs-typeorm-paginate';
import { InvoiceEntity } from '../../Domain/Entities/invoice.entity';

const invoiceServiceMock = () => ({
  paginate: jest.fn(),
});

const pagination = new Pagination(
  [new InvoiceEntity()],
  {
    currentPage: 0,
    itemCount: 0,
    itemsPerPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
  {},
);

describe('PaginateInvoicesQuery', () => {
  let invoiceService: InvoiceService, query: PaginateInvoicesQuery;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: InvoiceService, useFactory: invoiceServiceMock }],
    }).compile();

    invoiceService = await module.resolve(InvoiceService);
    query = new PaginateInvoicesQuery(invoiceService);
  });

  describe('execute', () => {
    it('uses invoice service to obtain paginated invoices', async () => {
      await query.execute({ page: 1, limit: 10 });

      expect(invoiceService.paginate).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });

    it('returns service response', async () => {
      jest.spyOn(invoiceService, 'paginate').mockResolvedValue(pagination);

      const result = await query.execute({ page: 1, limit: 10 });

      expect(result).toEqual(pagination);
    });
  });
});
