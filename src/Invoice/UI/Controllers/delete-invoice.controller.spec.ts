import { Test } from '@nestjs/testing';
import { GetInvoiceQuery } from '../../App/Queries/get-invoice.query';
import { NotFoundException } from '@nestjs/common';
import { DeleteInvoiceAction } from '../../App/Actions/delete-invoice.action';
import { DeleteInvoiceController } from './delete-invoice.controller';
import { Invoice } from '../../Domain/invoice';
import { InvoiceEntity } from '../../Domain/Entities/invoice.entity';
import { InvoiceRowEntity } from '../../Domain/Entities/invoice-row.entity';

const getInvoiceQueryMock = () => ({
  execute: jest.fn(),
});

const deleteInvoiceActionMock = () => ({
  execute: jest.fn(),
});

describe('DeleteInvoiceController', () => {
  let controller: DeleteInvoiceController,
    query: GetInvoiceQuery,
    action: DeleteInvoiceAction;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: GetInvoiceQuery, useFactory: getInvoiceQueryMock },
        { provide: DeleteInvoiceAction, useFactory: deleteInvoiceActionMock },
      ],
    }).compile();

    query = await module.resolve(GetInvoiceQuery);
    action = await module.resolve(DeleteInvoiceAction);
    controller = new DeleteInvoiceController(action, query);
  });

  describe('delete', () => {
    const invoiceEntity = new InvoiceEntity();
    invoiceEntity.id = 'id';
    const invoice = new Invoice(invoiceEntity, [new InvoiceRowEntity()]);

    it('uses get invoice query to obtain invoice by id', async () => {
      jest.spyOn(query, 'execute').mockResolvedValue(invoice);

      await controller.delete('id');

      expect(query.execute).toHaveBeenCalledWith('id');
    });

    it('throws exception if invoice not exist by id', async () => {
      jest.spyOn(query, 'execute').mockResolvedValue(null);

      await expect(controller.delete('id')).rejects.toThrow(NotFoundException);
    });

    it('uses delete invoice action', async () => {
      jest.spyOn(query, 'execute').mockResolvedValue(invoice);

      await controller.delete('id');

      expect(action.execute).toHaveBeenCalledWith(invoiceEntity.id);
    });
  });
});
