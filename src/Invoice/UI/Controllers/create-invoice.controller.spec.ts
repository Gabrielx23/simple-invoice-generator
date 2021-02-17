import { Test } from '@nestjs/testing';
import { CreateInvoiceController } from './create-invoice.controller';
import { CreateInvoiceAction } from '../../App/Actions/create-invoice.action';
import { CreateInvoiceDTO } from '../DTO/create-invoice.dto';

const createInvoiceActionMock = () => ({
  execute: jest.fn(),
});

describe('CreateInvoiceController', () => {
  let controller: CreateInvoiceController, action: CreateInvoiceAction;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: CreateInvoiceAction, useFactory: createInvoiceActionMock },
      ],
    }).compile();

    action = await module.resolve(CreateInvoiceAction);
    controller = new CreateInvoiceController(action);
  });

  describe('create', () => {
    const dto = new CreateInvoiceDTO();

    it('uses create action to create invoice', async () => {
      await controller.create(dto);

      expect(action.execute).toHaveBeenCalledWith(dto);
    });
  });
});
