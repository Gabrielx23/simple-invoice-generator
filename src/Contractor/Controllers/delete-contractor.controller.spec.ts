import { Test } from '@nestjs/testing';
import { ContractorService } from '../Providers/contractor.service';
import { ContractorEntity } from '../Database/Entities/contractor.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InvoiceEntity } from '../../Invoice/Domain/Entities/invoice.entity';
import { DeleteContractorController } from './delete-contractor.controller';

const contractorServiceMock = () => ({
  findOneWithInvoices: jest.fn(),
  delete: jest.fn(),
});

describe('DeleteContractorController', () => {
  let service: ContractorService, controller: DeleteContractorController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: ContractorService, useFactory: contractorServiceMock },
      ],
    }).compile();

    service = await module.resolve(ContractorService);
    controller = new DeleteContractorController(service);
  });

  describe('delete', () => {
    const contractor = new ContractorEntity();

    it('throws exception if contractor by id not exist', async () => {
      jest.spyOn(service, 'findOneWithInvoices').mockResolvedValue(null);

      await expect(controller.delete('id')).rejects.toThrow(NotFoundException);

      expect(service.findOneWithInvoices).toHaveBeenCalledWith('id');
    });

    it('throws exception if contractor has any invoices', async () => {
      contractor.invoices = [new InvoiceEntity()];

      jest.spyOn(service, 'findOneWithInvoices').mockResolvedValue(contractor);

      await expect(controller.delete('id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('returns contractor service result', async () => {
      contractor.invoices = [];

      jest.spyOn(service, 'findOneWithInvoices').mockResolvedValue(contractor);
      jest.spyOn(service, 'delete').mockResolvedValue(contractor);

      const result = await controller.delete('id');

      expect(service.delete).toHaveBeenCalledWith(contractor);
      expect(result).toEqual(contractor);
    });
  });
});
