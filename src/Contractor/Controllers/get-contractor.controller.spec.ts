import { Test } from '@nestjs/testing';
import { ContractorService } from '../Providers/contractor.service';
import { ContractorEntity } from '../Database/Entities/contractor.entity';
import { NotFoundException } from '@nestjs/common';
import { GetContractorController } from './get-contractor.controller';

const contractorServiceMock = () => ({
  findOne: jest.fn(),
});

describe('GetContractorController', () => {
  let service: ContractorService, controller: GetContractorController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: ContractorService, useFactory: contractorServiceMock },
      ],
    }).compile();

    service = await module.resolve(ContractorService);
    controller = new GetContractorController(service);
  });

  describe('get', () => {
    const contractor = new ContractorEntity();

    it('throws exception if contractor by id not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.get('id')).rejects.toThrow(NotFoundException);

      expect(service.findOne).toHaveBeenCalledWith('id');
    });

    it('returns contractor service result', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(contractor);

      const result = await controller.get('id');

      expect(result).toEqual(contractor);
    });
  });
});
