import { Test } from '@nestjs/testing';
import { InvoiceService } from '../../Domain/invoice.service';
import { InvoiceFactory } from '../../Domain/invoice.factory';
import { CreateInvoiceAction } from './create-invoice.action';
import { Invoice } from '../../Domain/invoice';
import { CreateInvoiceDTO } from '../../../App/Invoice/DTO/create-invoice.dto';
import { AddInvoiceRowDTO } from '../../../App/Invoice/DTO/add-invoice-row.dto';
import { policyCollection } from '../../Domain/policy.collection';

const invoiceServiceMock = () => ({
  getInvoiceAmountThisYear: jest.fn(),
  store: jest.fn(),
});

const invoiceFactoryMock = () => ({
  create: jest.fn(),
});

const invoiceMock = () => ({
  generateNumber: jest.fn(),
  calculateTotal: jest.fn(),
  book: jest.fn(),
});

describe('CreateInvoiceAction', () => {
  let invoiceService: InvoiceService,
    invoiceFactory: InvoiceFactory,
    invoice: Invoice,
    action: CreateInvoiceAction;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: InvoiceFactory, useFactory: invoiceFactoryMock },
        { provide: InvoiceService, useFactory: invoiceServiceMock },
        { provide: Invoice, useFactory: invoiceMock },
      ],
    }).compile();

    invoice = await module.resolve(Invoice);
    invoiceFactory = await module.resolve(InvoiceFactory);
    invoiceService = await module.resolve(InvoiceService);
    action = new CreateInvoiceAction(invoiceService, invoiceFactory);
  });

  describe('execute', () => {
    const rowDto = new AddInvoiceRowDTO();

    const dto = new CreateInvoiceDTO();
    dto.rows = [rowDto];

    it('uses invoice factory to create new invoice instance', async () => {
      jest.spyOn(invoiceFactory, 'create').mockReturnValue(invoice);

      await action.execute(dto);

      const { rows, ...data } = dto;

      expect(invoiceFactory.create).toBeCalledWith(data, rows);
    });

    it('uses invoice service to obtain invoices amount this year', async () => {
      jest.spyOn(invoiceFactory, 'create').mockReturnValue(invoice);

      await action.execute(dto);

      expect(invoiceService.getInvoiceAmountThisYear).toHaveBeenCalled();
    });

    it('generates invoice number', async () => {
      jest.spyOn(invoiceFactory, 'create').mockReturnValue(invoice);

      jest
        .spyOn(invoiceService, 'getInvoiceAmountThisYear')
        .mockResolvedValue(10);

      await action.execute(dto);

      expect(invoice.generateNumber).toBeCalledWith(10);
    });

    it('calculates invoice total', async () => {
      jest.spyOn(invoiceFactory, 'create').mockReturnValue(invoice);

      await action.execute(dto);

      expect(invoice.calculateTotal).toBeCalled();
    });

    it('books invoice with policy collection', async () => {
      jest.spyOn(invoiceFactory, 'create').mockReturnValue(invoice);

      await action.execute(dto);

      expect(invoice.book).toHaveBeenCalledWith(policyCollection);
    });

    it('uses invoice service to store invoice', async () => {
      jest.spyOn(invoiceFactory, 'create').mockReturnValue(invoice);

      await action.execute(dto);

      expect(invoiceService.store).toHaveBeenCalledWith(invoice);
    });
  });
});
