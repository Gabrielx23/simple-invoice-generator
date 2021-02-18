import { Test } from '@nestjs/testing';
import { InvoiceService } from '../../Domain/invoice.service';
import { Invoice } from '../../Domain/invoice';
import { policyCollection } from '../../Domain/policy.collection';
import { InvoiceRowDTO } from '../../UI/DTO/invoice-row.dto';
import { UpdateInvoiceAction } from './update-invoice.action';
import { UpdateInvoiceDTO } from '../../UI/DTO/update-invoice.dto';

const invoiceServiceMock = () => ({
  getInvoiceAmountThisYear: jest.fn(),
  update: jest.fn(),
});

const invoiceMock = () => ({
  calculateTotal: jest.fn(),
  book: jest.fn(),
});

describe('UpdateInvoiceAction', () => {
  let invoiceService: InvoiceService,
    invoice: Invoice,
    action: UpdateInvoiceAction;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: InvoiceService, useFactory: invoiceServiceMock },
        { provide: Invoice, useFactory: invoiceMock },
      ],
    }).compile();

    invoice = await module.resolve(Invoice);
    invoiceService = await module.resolve(InvoiceService);
    action = new UpdateInvoiceAction(invoiceService);
  });

  describe('execute', () => {
    const rowDto = new InvoiceRowDTO();

    const dto = new UpdateInvoiceDTO();
    dto.rows = [rowDto];

    it('calculates invoice total', async () => {
      await action.execute(invoice, dto);

      expect(invoice.calculateTotal).toBeCalled();
    });

    it('books invoice with policy collection', async () => {
      await action.execute(invoice, dto);

      expect(invoice.book).toHaveBeenCalledWith(policyCollection);
    });

    it('uses invoice service to update invoice', async () => {
      await action.execute(invoice, dto);

      expect(invoiceService.update).toHaveBeenCalledWith(invoice);
    });
  });
});
