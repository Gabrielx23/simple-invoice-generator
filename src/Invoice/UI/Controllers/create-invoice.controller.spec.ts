import { Test } from '@nestjs/testing';
import { CreateInvoiceController } from './create-invoice.controller';
import { CreateInvoiceAction } from '../../App/Actions/create-invoice.action';
import { CreateInvoiceDTO } from '../DTO/create-invoice.dto';
import { ContractorGateway } from '../../../Contractor/Providers/contractor.gateway';
import { NotFoundException } from '@nestjs/common';
import { ContractorEntity } from '../../../Contractor/Database/Entities/contractor.entity';

const createInvoiceActionMock = () => ({
  execute: jest.fn(),
});

const contractorGatewayMock = () => ({
  getContractorById: jest.fn(),
});

describe('CreateInvoiceController', () => {
  let controller: CreateInvoiceController,
    action: CreateInvoiceAction,
    gateway: ContractorGateway;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: CreateInvoiceAction, useFactory: createInvoiceActionMock },
        { provide: ContractorGateway, useFactory: contractorGatewayMock },
      ],
    }).compile();

    action = await module.resolve(CreateInvoiceAction);
    gateway = await module.resolve(ContractorGateway);

    controller = new CreateInvoiceController(action, gateway);
  });

  describe('create', () => {
    const contractor = new ContractorEntity();
    const dto = new CreateInvoiceDTO();
    dto.contractorId = 'contractorId';

    it('throws exception if contractor by id not exist', async () => {
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(null);

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);

      expect(gateway.getContractorById).toHaveBeenCalledWith(dto.contractorId);
    });

    it('uses create action to create invoice', async () => {
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(contractor);

      await controller.create(dto);

      expect(action.execute).toHaveBeenCalledWith(dto);
    });
  });
});
