import { Test } from '@nestjs/testing';
import { GetInvoiceQuery } from '../../App/Queries/get-invoice.query';
import { GetInvoiceController } from './get-invoice.controller';
import { InvoiceDTO } from '../../App/DTO/invoice.dto';
import { NotFoundException } from '@nestjs/common';

const getInvoiceQueryMock = () => ({
  execute: jest.fn(),
});

describe('GetInvoiceController', () => {
  let controller: GetInvoiceController, query: GetInvoiceQuery;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: GetInvoiceQuery, useFactory: getInvoiceQueryMock },
      ],
    }).compile();

    query = await module.resolve(GetInvoiceQuery);
    controller = new GetInvoiceController(query);
  });

  describe('get', () => {
    const dto = new InvoiceDTO();

    it('uses get invoice query to obtain invoice by id', async () => {
      jest.spyOn(query, 'execute').mockResolvedValue(dto);

      await controller.get('id');

      expect(query.execute).toHaveBeenCalledWith('id');
    });

    it('throws exception if invoice not exist by id', async () => {
      jest.spyOn(query, 'execute').mockResolvedValue(null);

      await expect(controller.get('id')).rejects.toThrow(NotFoundException);
    });

    it('returns invoice dto if invoice exist by id', async () => {
      jest.spyOn(query, 'execute').mockResolvedValue(dto);

      const result = await controller.get('id');

      expect(result).toEqual(dto);
    });
  });
});
