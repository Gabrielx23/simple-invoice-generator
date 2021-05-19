import { Test } from '@nestjs/testing';
import { CompanyService } from '../Providers/company.service';
import { CompanyEntity } from '../Database/Entities/company.entity';
import { NotFoundException } from '@nestjs/common';
import { GetCompanyController } from './get-company.controller';

const companyServiceMock = () => ({
  findOne: jest.fn(),
});

describe('GetCompanyController', () => {
  let service: CompanyService, controller: GetCompanyController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: CompanyService, useFactory: companyServiceMock }],
    }).compile();

    service = await module.resolve(CompanyService);
    controller = new GetCompanyController(service);
  });

  describe('get', () => {
    const company = new CompanyEntity();

    it('throws exception if company by id not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.get('id')).rejects.toThrow(NotFoundException);

      expect(service.findOne).toHaveBeenCalledWith('id');
    });

    it('returns company service result', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(company);

      const result = await controller.get('id');

      expect(result).toEqual(company);
    });
  });
});
