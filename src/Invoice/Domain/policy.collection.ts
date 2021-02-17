import { CorrectInvoiceDatesPolicy } from './Policies/correct-invoice-dates.policy';
import { InvoiceHasCalculatedTotalPolicy } from './Policies/invoice-has-calculated-total.policy';
import { InvoiceHasNumberPolicy } from './Policies/invoice-has-number.policy';
import { NoRowDuplicatesPolicy } from './Policies/no-row-duplicates.policy';

export const policyCollection = [
  new CorrectInvoiceDatesPolicy(),
  new InvoiceHasCalculatedTotalPolicy(),
  new InvoiceHasNumberPolicy(),
  new NoRowDuplicatesPolicy(),
];
