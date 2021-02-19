import { Test } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyRepository } from '../Database/Repositories/company.repository';
import { CompanyDTO } from '../DTO/company.dto';
import { CompanyEntity } from '../Database/Entities/company.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

const repositoryMock = () => ({
  create: jest.fn(),
  save: jest.fn(),
  paginate: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  findOneWithInvoices: jest.fn(),
});

describe('CompanyService', () => {
  let service: CompanyService, repository: CompanyRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: CompanyRepository, useFactory: repositoryMock }],
    }).compile();

    repository = await module.get(CompanyRepository);
    service = new CompanyService(repository);
  });

  describe('create', () => {
    const dto = new CompanyDTO();
    const company = new CompanyEntity();

    it('uses company repository to create company partial from dto', async () => {
      await service.create(dto);

      expect(repository.create).toBeCalledWith(dto);
    });

    it('uses company repository to save created company', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(company);

      await service.create(dto);

      expect(repository.save).toHaveBeenCalledWith(company);
    });

    it('returns created company', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(company);
      jest.spyOn(repository, 'save').mockResolvedValue(company);

      const result = await service.create(dto);

      expect(result).toEqual(company);
    });
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

    it('uses company repository to obtain paginated companys', async () => {
      await service.paginate({ page: 1, limit: 10 });

      expect(repository.paginate).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('returns paginated companys', async () => {
      jest.spyOn(repository, 'paginate').mockResolvedValue(pagination);

      const result = await service.paginate({ page: 1, limit: 10 });

      expect(result).toEqual(pagination);
    });
  });

  describe('findOne', () => {
    const company = new CompanyEntity();

    it('uses company repository to obtain company by id', async () => {
      await service.findOne('id');

      expect(repository.findOne).toHaveBeenCalledWith({ id: 'id' });
    });

    it('returns obtained company', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(company);

      const result = await service.findOne('id');

      expect(result).toEqual(company);
    });
  });

  describe('findOneByVatId', () => {
    const company = new CompanyEntity();

    it('uses company repository to obtain company by abbreviation', async () => {
      await service.findOneByVatId('vatId');

      expect(repository.findOne).toHaveBeenCalledWith({
        vatId: 'vatId',
      });
    });

    it('returns obtained company', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(company);

      const result = await service.findOneByVatId('vatId');

      expect(result).toEqual(company);
    });
  });

  describe('findOneWithInvoices', () => {
    const company = new CompanyEntity();

    it('uses company repository to obtain company by id with invoices', async () => {
      await service.findOneWithInvoices('id');

      expect(repository.findOneWithInvoices).toHaveBeenCalledWith('id');
    });

    it('returns obtained company', async () => {
      jest.spyOn(repository, 'findOneWithInvoices').mockResolvedValue(company);

      const result = await service.findOneWithInvoices('vatId');

      expect(result).toEqual(company);
    });
  });

  describe('delete', () => {
    const company = new CompanyEntity();
    company.id = 'id';

    it('uses company repository to delete given company', async () => {
      await service.delete(company);

      expect(repository.delete).toHaveBeenCalledWith({ id: company.id });
    });

    it('returns deleted company', async () => {
      const result = await service.delete(company);

      expect(result).toEqual(company);
    });
  });

  describe('update', () => {
    const company = new CompanyEntity();
    company.name = 'name 1';

    const dto = new CompanyDTO();
    dto.name = 'name 2';

    it('uses company repository to save changed company', async () => {
      await service.update(company, dto);

      const updated = { ...company, ...dto };

      expect(repository.save).toHaveBeenCalledWith(updated);
    });

    it('returns updated company', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(company);

      const result = await service.update(company, dto);

      expect(result).toEqual(company);
    });
  });
});
