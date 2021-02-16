import { InvoiceEntity } from '../Entities/invoice.entity';

export abstract class InvoiceEntityPolicy {
  public abstract isSatisfied(
    invoiceEntity: InvoiceEntity | Partial<InvoiceEntity>,
  ): Promise<void>;
}
