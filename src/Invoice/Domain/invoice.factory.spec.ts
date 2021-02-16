import { InvoiceFactory } from './invoice.factory';
import { InvoiceEntity } from './Entities/invoice.entity';
import { InvoiceRowEntity } from './Entities/invoice-row.entity';
import { Invoice } from './invoice';

const invoiceRowEntity = new InvoiceRowEntity();

const invoiceEntity = new InvoiceEntity();
invoiceEntity.rows = [invoiceRowEntity];

const invoice = new Invoice(invoiceEntity, invoiceEntity.rows);

describe('InvoiceFactory', () => {
  let invoiceFactory: InvoiceFactory;

  beforeEach(async () => {
    invoiceFactory = new InvoiceFactory();
  });

  describe('create', () => {
    it('returns properly created invoice instance', async () => {
      const result = invoiceFactory.create(invoiceEntity, invoiceEntity.rows);

      expect(result).toEqual(invoice);
    });
  });
});
