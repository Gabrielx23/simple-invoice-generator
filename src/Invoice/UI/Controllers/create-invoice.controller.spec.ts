import { Test } from '@nestjs/testing';
import { CreateInvoiceController } from './create-invoice.controller';
import { CreateInvoiceAction } from '../../App/Actions/create-invoice.action';
import { CreateInvoiceDTO } from '../DTO/create-invoice.dto';
import { ContractorGateway } from '../../../Contractor/Providers/contractor.gateway';
import { NotFoundException } from '@nestjs/common';
import { ContractorEntity } from '../../../Contractor/Database/Entities/contractor.entity';
import { CompanyGateway } from '../../../Company/Providers/company.gateway';
import { CompanyEntity } from '../../../Company/Database/Entities/company.entity';

const createInvoiceActionMock = () => ({
  execute: jest.fn(),
});

const contractorGatewayMock = () => ({
  getContractorById: jest.fn(),
});

const companyGatewayMock = () => ({
  getCompanyById: jest.fn(),
});

describe('CreateInvoiceController', () => {
  let controller: CreateInvoiceController,
    action: CreateInvoiceAction,
    companyGateway: CompanyGateway,
    gateway: ContractorGateway;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: CreateInvoiceAction, useFactory: createInvoiceActionMock },
        { provide: ContractorGateway, useFactory: contractorGatewayMock },
        { provide: CompanyGateway, useFactory: companyGatewayMock },
      ],
    }).compile();

    action = await module.resolve(CreateInvoiceAction);
    gateway = await module.resolve(ContractorGateway);
    companyGateway = await module.resolve(CompanyGateway);

    controller = new CreateInvoiceController(action, gateway, companyGateway);
  });

  describe('create', () => {
    const contractor = new ContractorEntity();
    const company = new CompanyEntity();
    const dto = new CreateInvoiceDTO();
    dto.contractorId = 'contractorId';
    dto.companyId = 'companyId';

    it('throws exception if contractor by id not exist', async () => {
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(null);

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);

      expect(gateway.getContractorById).toHaveBeenCalledWith(dto.contractorId);
    });

    it('throws exception if company by id not exist', async () => {
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(contractor);
      jest.spyOn(companyGateway, 'getCompanyById').mockResolvedValue(null);

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);

      expect(companyGateway.getCompanyById).toHaveBeenCalledWith(dto.companyId);
    });

    it('uses create action to create invoice', async () => {
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(contractor);
      jest.spyOn(companyGateway, 'getCompanyById').mockResolvedValue(company);

      await controller.create(dto);

      expect(action.execute).toHaveBeenCalledWith(dto);
    });
  });
});
