import { Test } from '@nestjs/testing';
import { InvoiceEntity } from './Entities/invoice.entity';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';
import { Invoice } from './invoice';
import { CorrectInvoiceDatesPolicy } from './Policies/correct-invoice-dates.policy';

const policyMock = () => ({
  isSatisfied: jest.fn(),
});

const invoiceRowEntity1 = new InvoiceRowEntity();
invoiceRowEntity1.price = '10.00';
invoiceRowEntity1.vat = 23;

const invoiceRowEntity2 = new InvoiceRowEntity();
invoiceRowEntity2.price = '10.00';
invoiceRowEntity2.vat = null;

const invoiceEntity = new InvoiceEntity();
invoiceEntity.rows = [invoiceRowEntity1, invoiceRowEntity2];

describe('Invoice', () => {
  let policy: CorrectInvoiceDatesPolicy, invoice: Invoice;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: CorrectInvoiceDatesPolicy, useFactory: policyMock },
      ],
    }).compile();

    policy = await module.resolve(CorrectInvoiceDatesPolicy);
    invoice = new Invoice(invoiceEntity, invoiceEntity.rows);
  });

  describe('book', () => {
    it('checks all set policies', async () => {
      await invoice.book([policy, policy]);

      expect(policy.isSatisfied).toHaveBeenNthCalledWith(
        2,
        invoiceEntity,
        invoiceEntity.rows,
      );
    });
  });

  describe('generateNumber', () => {
    it('not change invoice number if number exist', async () => {
      invoice.data.number = '1/2021';

      await invoice.generateNumber(2);

      expect(invoice.data.number).toEqual(invoiceEntity.number);
    });

    it('correctly generates new invoice number', async () => {
      invoice.data.number = undefined;

      const currentDate = new Date();
      const amountOfInvoices = 2;
      const expectedNumber = `3/${currentDate.getFullYear()}`;

      await invoice.generateNumber(amountOfInvoices);

      expect(invoice.data.number).toEqual(expectedNumber);
    });
  });

  describe('calculateTotal', () => {
    it('correctly sets invoice total', async () => {
      const expectedValue = '22.30';

      await invoice.calculateTotal();

      expect(invoice.data.total).toEqual(expectedValue);
    });
  });

  describe('getTotalWithoutVat', () => {
    it('returns total without vat', async () => {
      const expectedValue = '20.00';

      const result = await invoice.getTotalWithoutVat();

      expect(result).toEqual(expectedValue);
    });
  });

  describe('getTotalVat', () => {
    it('returns total vat', async () => {
      const expectedValue = '2.30';

      const result = await invoice.getTotalVat();

      expect(result).toEqual(expectedValue);
    });
  });
});
