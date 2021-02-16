import { InvoiceRowEntity } from '../Entities/invoice-row.entity';

export abstract class InvoiceRowsPolicy {
  public abstract isSatisfied(
    rows: Array<Partial<InvoiceRowEntity>> | Array<InvoiceRowEntity>,
  ): Promise<void>;
}
