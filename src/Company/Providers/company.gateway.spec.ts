import { Test } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyEntity } from '../Database/Entities/company.entity';
import { CompanyGateway } from './company.gateway';

const companyServiceMock = () => ({
  findOne: jest.fn(),
});

describe('CompanyGateway', () => {
  let service: CompanyService, gateway: CompanyGateway;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: CompanyService, useFactory: companyServiceMock }],
    }).compile();

    service = await module.resolve(CompanyService);
    gateway = new CompanyGateway(service);
  });

  describe('getCompanyById', () => {
    const company = new CompanyEntity();

    it('returns company service result', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(company);

      const result = await gateway.getCompanyById('id');

      expect(service.findOne).toHaveBeenCalledWith('id');
      expect(result).toEqual(company);
    });
  });
});
