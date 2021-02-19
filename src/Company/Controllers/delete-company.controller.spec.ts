import { Test } from '@nestjs/testing';
import { CompanyService } from '../Providers/company.service';
import { CompanyEntity } from '../Database/Entities/company.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InvoiceEntity } from '../../Invoice/Domain/Entities/invoice.entity';
import { DeleteCompanyController } from './delete-company.controller';

const companyServiceMock = () => ({
  findOneWithInvoices: jest.fn(),
  delete: jest.fn(),
});

describe('DeleteCompanyController', () => {
  let service: CompanyService, controller: DeleteCompanyController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: CompanyService, useFactory: companyServiceMock }],
    }).compile();

    service = await module.resolve(CompanyService);
    controller = new DeleteCompanyController(service);
  });

  describe('delete', () => {
    const company = new CompanyEntity();

    it('throws exception if company by id not exist', async () => {
      jest.spyOn(service, 'findOneWithInvoices').mockResolvedValue(null);

      await expect(controller.delete('id')).rejects.toThrow(NotFoundException);

      expect(service.findOneWithInvoices).toHaveBeenCalledWith('id');
    });

    it('throws exception if company has any invoices', async () => {
      company.invoices = [new InvoiceEntity()];

      jest.spyOn(service, 'findOneWithInvoices').mockResolvedValue(company);

      await expect(controller.delete('id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('returns company service result', async () => {
      company.invoices = [];

      jest.spyOn(service, 'findOneWithInvoices').mockResolvedValue(company);
      jest.spyOn(service, 'delete').mockResolvedValue(company);

      const result = await controller.delete('id');

      expect(service.delete).toHaveBeenCalledWith(company);
      expect(result).toEqual(company);
    });
  });
});
