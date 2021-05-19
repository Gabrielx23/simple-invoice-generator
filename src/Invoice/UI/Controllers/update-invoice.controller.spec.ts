import { Test } from '@nestjs/testing';
import { UpdateInvoiceAction } from '../../App/Actions/update-invoice.action';
import { GetInvoiceQuery } from '../../App/Queries/get-invoice.query';
import { UpdateInvoiceController } from './update-invoice.controller';
import { UpdateInvoiceDTO } from '../DTO/update-invoice.dto';
import { Invoice } from '../../Domain/invoice';
import { InvoiceEntity } from '../../Domain/Entities/invoice.entity';
import { InvoiceRowEntity } from '../../Domain/Entities/invoice-row.entity';
import { NotFoundException } from '@nestjs/common';
import { InvoiceDTO } from '../../App/DTO/invoice.dto';
import { ContractorGateway } from '../../../Contractor/Providers/contractor.gateway';
import { ContractorEntity } from '../../../Contractor/Database/Entities/contractor.entity';
import { CompanyGateway } from '../../../Company/Providers/company.gateway';
import { CompanyEntity } from '../../../Company/Database/Entities/company.entity';

const updateInvoiceActionMock = () => ({
  execute: jest.fn(),
});

const getInvoiceQueryMock = () => ({
  execute: jest.fn(),
});

const contractorGatewayMock = () => ({
  getContractorById: jest.fn(),
});

const companyGatewayMock = () => ({
  getCompanyById: jest.fn(),
});

describe('UpdateInvoiceController', () => {
  let controller: UpdateInvoiceController,
    action: UpdateInvoiceAction,
    gateway: ContractorGateway,
    companyGateway: CompanyGateway,
    query: GetInvoiceQuery;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: UpdateInvoiceAction, useFactory: updateInvoiceActionMock },
        { provide: GetInvoiceQuery, useFactory: getInvoiceQueryMock },
        { provide: ContractorGateway, useFactory: contractorGatewayMock },
        { provide: CompanyGateway, useFactory: companyGatewayMock },
      ],
    }).compile();

    action = await module.resolve(UpdateInvoiceAction);
    query = await module.resolve(GetInvoiceQuery);
    gateway = await module.resolve(ContractorGateway);
    companyGateway = await module.resolve(CompanyGateway);
    controller = new UpdateInvoiceController(
      action,
      query,
      gateway,
      companyGateway,
    );
  });

  describe('update', () => {
    const contractor = new ContractorEntity();
    const company = new CompanyEntity();
    const invoiceDTO = new InvoiceDTO();
    const dto = new UpdateInvoiceDTO();
    dto.contractorId = 'contractorId';
    dto.companyId = 'companyId';
    const invoice = new Invoice(new InvoiceEntity(), [new InvoiceRowEntity()]);

    it('uses get invoice query to obtain query by id', async () => {
      jest.spyOn(companyGateway, 'getCompanyById').mockResolvedValue(company);
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(contractor);
      jest.spyOn(query, 'execute').mockResolvedValue(invoice);

      await controller.update('id', dto);

      expect(query.execute).toHaveBeenCalledWith('id', false);
    });

    it('throws exception if invoice by id not exist', async () => {
      jest.spyOn(companyGateway, 'getCompanyById').mockResolvedValue(company);
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(contractor);
      jest.spyOn(query, 'execute').mockResolvedValue(null);

      await expect(controller.update('id', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws exception if contractor by id not exist', async () => {
      jest.spyOn(query, 'execute').mockResolvedValue(invoice);
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(null);

      await expect(controller.update('id', dto)).rejects.toThrow(
        NotFoundException,
      );

      expect(gateway.getContractorById).toHaveBeenCalledWith(dto.contractorId);
    });

    it('throws exception if company by id not exist', async () => {
      jest.spyOn(query, 'execute').mockResolvedValue(invoice);
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(contractor);
      jest.spyOn(companyGateway, 'getCompanyById').mockResolvedValue(null);

      await expect(controller.update('id', dto)).rejects.toThrow(
        NotFoundException,
      );

      expect(companyGateway.getCompanyById).toHaveBeenCalledWith(dto.companyId);
    });

    it('uses update invoice action to update invoice', async () => {
      jest.spyOn(companyGateway, 'getCompanyById').mockResolvedValue(company);
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(contractor);
      jest.spyOn(query, 'execute').mockResolvedValue(invoice);

      await controller.update('id', dto);

      expect(action.execute).toHaveBeenCalledWith(invoice, dto);
    });

    it('uses get invoice query to obtain invoice dto and returns it', async () => {
      jest.spyOn(companyGateway, 'getCompanyById').mockResolvedValue(company);
      jest.spyOn(gateway, 'getContractorById').mockResolvedValue(contractor);

      jest
        .spyOn(query, 'execute')
        .mockResolvedValueOnce(invoice)
        .mockResolvedValueOnce(invoiceDTO);

      const result = await controller.update('id', dto);

      expect(result).toEqual(invoiceDTO);
      expect(query.execute).toHaveBeenCalledWith('id');
    });
  });
});
