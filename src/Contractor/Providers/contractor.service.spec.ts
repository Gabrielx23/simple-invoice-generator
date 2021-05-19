import { Test } from '@nestjs/testing';
import { ContractorService } from './contractor.service';
import { ContractorRepository } from '../Database/Repositories/contractor.repository';
import { ContractorDTO } from '../DTO/contractor.dto';
import { ContractorEntity } from '../Database/Entities/contractor.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

const repositoryMock = () => ({
  create: jest.fn(),
  save: jest.fn(),
  paginate: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  findOneWithInvoices: jest.fn(),
});

describe('ContractorService', () => {
  let service: ContractorService, repository: ContractorRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: ContractorRepository, useFactory: repositoryMock },
      ],
    }).compile();

    repository = await module.get(ContractorRepository);
    service = new ContractorService(repository);
  });

  describe('create', () => {
    const dto = new ContractorDTO();
    const contractor = new ContractorEntity();

    it('uses contractor repository to create contractor partial from dto', async () => {
      await service.create(dto);

      expect(repository.create).toBeCalledWith(dto);
    });

    it('uses contractor repository to save created contractor', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(contractor);

      await service.create(dto);

      expect(repository.save).toHaveBeenCalledWith(contractor);
    });

    it('returns created contractor', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(contractor);
      jest.spyOn(repository, 'save').mockResolvedValue(contractor);

      const result = await service.create(dto);

      expect(result).toEqual(contractor);
    });
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

    it('uses contractor repository to obtain paginated contractors', async () => {
      await service.paginate({ page: 1, limit: 10 });

      expect(repository.paginate).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('returns paginated contractors', async () => {
      jest.spyOn(repository, 'paginate').mockResolvedValue(pagination);

      const result = await service.paginate({ page: 1, limit: 10 });

      expect(result).toEqual(pagination);
    });
  });

  describe('findOne', () => {
    const contractor = new ContractorEntity();

    it('uses contractor repository to obtain contractor by id', async () => {
      await service.findOne('id');

      expect(repository.findOne).toHaveBeenCalledWith({ id: 'id' });
    });

    it('returns obtained contractor', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(contractor);

      const result = await service.findOne('id');

      expect(result).toEqual(contractor);
    });
  });

  describe('findOneByAbbreviation', () => {
    const contractor = new ContractorEntity();

    it('uses contractor repository to obtain contractor by abbreviation', async () => {
      await service.findOneByAbbreviation('abbreviation');

      expect(repository.findOne).toHaveBeenCalledWith({
        abbreviation: 'abbreviation',
      });
    });

    it('returns obtained contractor', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(contractor);

      const result = await service.findOneByAbbreviation('abbreviation');

      expect(result).toEqual(contractor);
    });
  });

  describe('findOneByVatId', () => {
    const contractor = new ContractorEntity();

    it('uses contractor repository to obtain contractor by abbreviation', async () => {
      await service.findOneByVatId('vatId');

      expect(repository.findOne).toHaveBeenCalledWith({
        vatId: 'vatId',
      });
    });

    it('returns obtained contractor', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(contractor);

      const result = await service.findOneByVatId('vatId');

      expect(result).toEqual(contractor);
    });
  });

  describe('findOneWithInvoices', () => {
    const contractor = new ContractorEntity();

    it('uses contractor repository to obtain contractor by id with invoices', async () => {
      await service.findOneWithInvoices('id');

      expect(repository.findOneWithInvoices).toHaveBeenCalledWith('id');
    });

    it('returns obtained contractor', async () => {
      jest
        .spyOn(repository, 'findOneWithInvoices')
        .mockResolvedValue(contractor);

      const result = await service.findOneWithInvoices('vatId');

      expect(result).toEqual(contractor);
    });
  });

  describe('delete', () => {
    const contractor = new ContractorEntity();
    contractor.id = 'id';

    it('uses contractor repository to delete given contractor', async () => {
      await service.delete(contractor);

      expect(repository.delete).toHaveBeenCalledWith({ id: contractor.id });
    });

    it('returns deleted contractor', async () => {
      const result = await service.delete(contractor);

      expect(result).toEqual(contractor);
    });
  });

  describe('update', () => {
    const contractor = new ContractorEntity();
    contractor.name = 'name 1';

    const dto = new ContractorDTO();
    dto.name = 'name 2';

    it('uses contractor repository to save changed contractor', async () => {
      await service.update(contractor, dto);

      const updated = { ...contractor, ...dto };

      expect(repository.save).toHaveBeenCalledWith(updated);
    });

    it('returns updated contractor', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(contractor);

      const result = await service.update(contractor, dto);

      expect(result).toEqual(contractor);
    });
  });
});
