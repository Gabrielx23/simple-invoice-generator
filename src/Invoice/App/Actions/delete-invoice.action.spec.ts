import { Test } from '@nestjs/testing';
import { InvoiceService } from '../../Domain/invoice.service';
import { DeleteInvoiceAction } from './delete-invoice.action';

const invoiceServiceMock = () => ({
  delete: jest.fn(),
});

describe('DeleteInvoiceAction', () => {
  let invoiceService: InvoiceService, action: DeleteInvoiceAction;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: InvoiceService, useFactory: invoiceServiceMock }],
    }).compile();

    invoiceService = await module.resolve(InvoiceService);
    action = new DeleteInvoiceAction(invoiceService);
  });

  describe('execute', () => {
    it('uses invoice service to delete invoice by id', async () => {
      await action.execute('id');

      expect(invoiceService.delete).toHaveBeenCalledWith('id');
    });
  });
});
