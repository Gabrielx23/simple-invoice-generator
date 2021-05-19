import { Test } from '@nestjs/testing';
import { CreateCompanyController } from './create-company.controller';
import { CompanyService } from '../Providers/company.service';
import { CompanyEntity } from '../Database/Entities/company.entity';
import { CompanyDTO } from '../DTO/company.dto';
import { BadRequestException } from '@nestjs/common';

const companyServiceMock = () => ({
  create: jest.fn(),
  findOneByVatId: jest.fn(),
});

describe('CreateCompanyController', () => {
  let service: CompanyService, controller: CreateCompanyController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: CompanyService, useFactory: companyServiceMock }],
    }).compile();

    service = await module.resolve(CompanyService);
    controller = new CreateCompanyController(service);
  });

  describe('create', () => {
    const company = new CompanyEntity();
    const dto = new CompanyDTO();
    dto.vatId = 'vatId';

    it('throws exception if vat id is already in use', async () => {
      jest.spyOn(service, 'findOneByVatId').mockResolvedValue(company);

      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);

      expect(service.findOneByVatId).toHaveBeenCalledWith(dto.vatId);
    });

    it('returns company service result', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(company);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(company);
    });
  });
});
