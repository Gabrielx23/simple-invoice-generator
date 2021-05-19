import { Test } from '@nestjs/testing';
import { ContractorService } from '../Providers/contractor.service';
import { ContractorEntity } from '../Database/Entities/contractor.entity';
import { ContractorDTO } from '../DTO/contractor.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateContractorController } from './update-contractor.controller';

const contractorServiceMock = () => ({
  update: jest.fn(),
  findOne: jest.fn(),
  findOneByVatId: jest.fn(),
  findOneByAbbreviation: jest.fn(),
});

describe('UpdateContractorController', () => {
  let service: ContractorService, controller: UpdateContractorController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: ContractorService, useFactory: contractorServiceMock },
      ],
    }).compile();

    service = await module.resolve(ContractorService);
    controller = new UpdateContractorController(service);
  });

  describe('update', () => {
    const contractor = new ContractorEntity();
    contractor.vatId = 'vatId';
    contractor.abbreviation = 'abbreviation';

    const contractorDTO = new ContractorDTO();
    contractorDTO.vatId = 'vatId';
    contractorDTO.abbreviation = 'abbreviation';

    it('throws exception if contractor by id not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.update('id', contractorDTO)).rejects.toThrow(
        NotFoundException,
      );

      expect(service.findOne).toHaveBeenCalledWith('id');
    });

    it('throws exception if vat id is already in use', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(contractor);
      jest
        .spyOn(service, 'findOneByVatId')
        .mockResolvedValue(new ContractorEntity());
      jest.spyOn(service, 'findOneByAbbreviation').mockResolvedValue(null);

      await expect(controller.update('id', contractorDTO)).rejects.toThrow(
        BadRequestException,
      );

      expect(service.findOneByVatId).toHaveBeenCalledWith('vatId');
    });

    it('throws exception if abbreviation is already in use', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(contractor);
      jest.spyOn(service, 'findOneByVatId').mockResolvedValue(null);
      jest
        .spyOn(service, 'findOneByAbbreviation')
        .mockResolvedValue(new ContractorEntity());

      await expect(controller.update('id', contractorDTO)).rejects.toThrow(
        BadRequestException,
      );

      expect(service.findOneByAbbreviation).toHaveBeenCalledWith(
        'abbreviation',
      );
    });

    it('returns contractor service result', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(contractor);
      jest.spyOn(service, 'update').mockResolvedValue(contractor);

      const result = await controller.update('id', contractorDTO);

      expect(service.update).toHaveBeenCalledWith(contractor, contractorDTO);
      expect(result).toEqual(contractor);
    });
  });
});
