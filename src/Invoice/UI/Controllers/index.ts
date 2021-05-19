import { CreateInvoiceController } from './create-invoice.controller';
import { GetInvoiceController } from './get-invoice.controller';
import { DeleteInvoiceController } from './delete-invoice.controller';
import { PaginateInvoicesController } from './paginate-invoices.controller';
import { UpdateInvoiceController } from './update-invoice.controller';
import { RenderInvoiceController } from './render-invoice.controller';

export const controllers = [
  CreateInvoiceController,
  GetInvoiceController,
  PaginateInvoicesController,
  DeleteInvoiceController,
  UpdateInvoiceController,
  RenderInvoiceController,
];
