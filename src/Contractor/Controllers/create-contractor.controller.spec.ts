import { Test } from '@nestjs/testing';
import { CreateContractorController } from './create-contractor.controller';
import { ContractorService } from '../Providers/contractor.service';
import { ContractorEntity } from '../Database/Entities/contractor.entity';
import { ContractorDTO } from '../DTO/contractor.dto';
import { BadRequestException } from '@nestjs/common';

const contractorServiceMock = () => ({
  create: jest.fn(),
  findOneByVatId: jest.fn(),
  findOneByAbbreviation: jest.fn(),
});

describe('CreateContractorController', () => {
  let service: ContractorService, controller: CreateContractorController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: ContractorService, useFactory: contractorServiceMock },
      ],
    }).compile();

    service = await module.resolve(ContractorService);
    controller = new CreateContractorController(service);
  });

  describe('create', () => {
    const contractor = new ContractorEntity();
    const dto = new ContractorDTO();
    dto.vatId = 'vatId';
    dto.abbreviation = 'abbreviation';

    it('throws exception if vat id is already in use', async () => {
      jest.spyOn(service, 'findOneByVatId').mockResolvedValue(contractor);
      jest.spyOn(service, 'findOneByAbbreviation').mockResolvedValue(null);

      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);

      expect(service.findOneByVatId).toHaveBeenCalledWith(dto.vatId);
    });

    it('throws exception if abbreviation is already in use', async () => {
      jest.spyOn(service, 'findOneByVatId').mockResolvedValue(null);
      jest
        .spyOn(service, 'findOneByAbbreviation')
        .mockResolvedValue(contractor);

      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);

      expect(service.findOneByAbbreviation).toHaveBeenCalledWith(
        dto.abbreviation,
      );
    });

    it('returns contractor service result', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(contractor);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(contractor);
    });
  });
});
