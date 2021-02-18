import { Test } from '@nestjs/testing';
import { PaginateInvoicesQuery } from '../../App/Queries/paginate-invoices.query';
import { PaginateInvoicesController } from './paginate-invoices.controller';
import { Pagination } from 'nestjs-typeorm-paginate';
import { InvoiceEntity } from '../../Domain/Entities/invoice.entity';

const paginateInvoiceQueryMock = () => ({
  execute: jest.fn(),
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

describe('PaginateInvoicesController', () => {
  let controller: PaginateInvoicesController, query: PaginateInvoicesQuery;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: PaginateInvoicesQuery,
          useFactory: paginateInvoiceQueryMock,
        },
      ],
    }).compile();

    query = await module.resolve(PaginateInvoicesQuery);
    controller = new PaginateInvoicesController(query);
  });

  describe('paginate', () => {
    it('uses paginate invoices query to obtain paginated invoices', async () => {
      jest.spyOn(query, 'execute').mockResolvedValue(pagination);

      await controller.paginate(1, 10);

      expect(query.execute).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('returns paginated invoices', async () => {
      jest.spyOn(query, 'execute').mockResolvedValue(pagination);

      const result = await controller.paginate(1, 10);

      expect(result).toEqual(pagination);
    });
  });
});
