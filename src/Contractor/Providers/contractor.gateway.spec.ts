import { Test } from '@nestjs/testing';
import { ContractorService } from './contractor.service';
import { ContractorEntity } from '../Database/Entities/contractor.entity';
import { ContractorGateway } from './contractor.gateway';

const contractorServiceMock = () => ({
  findOne: jest.fn(),
});

describe('ContractorGateway', () => {
  let service: ContractorService, gateway: ContractorGateway;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: ContractorService, useFactory: contractorServiceMock },
      ],
    }).compile();

    service = await module.resolve(ContractorService);
    gateway = new ContractorGateway(service);
  });

  describe('getContractorById', () => {
    const contractor = new ContractorEntity();

    it('returns contractor service result', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(contractor);

      const result = await gateway.getContractorById('id');

      expect(service.findOne).toHaveBeenCalledWith('id');
      expect(result).toEqual(contractor);
    });
  });
});
