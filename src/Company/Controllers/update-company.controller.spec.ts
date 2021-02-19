import { Test } from '@nestjs/testing';
import { CompanyService } from '../Providers/company.service';
import { CompanyEntity } from '../Database/Entities/company.entity';
import { CompanyDTO } from '../DTO/company.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateCompanyController } from './update-company.controller';

const companyServiceMock = () => ({
  update: jest.fn(),
  findOne: jest.fn(),
  findOneByVatId: jest.fn(),
});

describe('UpdateCompanyController', () => {
  let service: CompanyService, controller: UpdateCompanyController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: CompanyService, useFactory: companyServiceMock }],
    }).compile();

    service = await module.resolve(CompanyService);
    controller = new UpdateCompanyController(service);
  });

  describe('update', () => {
    const company = new CompanyEntity();
    company.vatId = 'vatId';

    const companyDTO = new CompanyDTO();
    companyDTO.vatId = 'vatId';

    it('throws exception if company by id not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.update('id', companyDTO)).rejects.toThrow(
        NotFoundException,
      );

      expect(service.findOne).toHaveBeenCalledWith('id');
    });

    it('throws exception if vat id is already in use', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(company);
      jest
        .spyOn(service, 'findOneByVatId')
        .mockResolvedValue(new CompanyEntity());

      await expect(controller.update('id', companyDTO)).rejects.toThrow(
        BadRequestException,
      );

      expect(service.findOneByVatId).toHaveBeenCalledWith('vatId');
    });

    it('returns company service result', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(company);
      jest.spyOn(service, 'update').mockResolvedValue(company);

      const result = await controller.update('id', companyDTO);

      expect(service.update).toHaveBeenCalledWith(company, companyDTO);
      expect(result).toEqual(company);
    });
  });
});
