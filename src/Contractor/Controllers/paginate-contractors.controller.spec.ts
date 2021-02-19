import { Test } from '@nestjs/testing';
import { ContractorService } from '../Providers/contractor.service';
import { ContractorEntity } from '../Database/Entities/contractor.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginateContractorsController } from './paginate-contractors.controller';

const contractorServiceMock = () => ({
  paginate: jest.fn(),
});

describe('PaginateContractorsController', () => {
  let service: ContractorService, controller: PaginateContractorsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: ContractorService, useFactory: contractorServiceMock },
      ],
    }).compile();

    service = await module.resolve(ContractorService);
    controller = new PaginateContractorsController(service);
  });

  describe('paginate', () => {
    const pagination = new Pagination(
      [new ContractorEntity()],
      {
        currentPage: 0,
        itemCount: 0,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 0,
      },
      {},
    );

    it('returns contractor service result', async () => {
      jest.spyOn(service, 'paginate').mockResolvedValue(pagination);

      const result = await controller.paginate(1, 10);

      expect(service.paginate).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(result).toEqual(pagination);
    });
  });
});
