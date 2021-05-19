import { Test } from '@nestjs/testing';
import { CompanyService } from '../Providers/company.service';
import { CompanyEntity } from '../Database/Entities/company.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginateCompaniesController } from './paginate-companies.controller';

const companyServiceMock = () => ({
  paginate: jest.fn(),
});

describe('PaginateCompaniesController', () => {
  let service: CompanyService, controller: PaginateCompaniesController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: CompanyService, useFactory: companyServiceMock }],
    }).compile();

    service = await module.resolve(CompanyService);
    controller = new PaginateCompaniesController(service);
  });

  describe('paginate', () => {
    const pagination = new Pagination(
      [new CompanyEntity()],
      {
        currentPage: 0,
        itemCount: 0,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 0,
      },
      {},
    );

    it('returns company service result', async () => {
      jest.spyOn(service, 'paginate').mockResolvedValue(pagination);

      const result = await controller.paginate(1, 10);

      expect(service.paginate).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(result).toEqual(pagination);
    });
  });
});
