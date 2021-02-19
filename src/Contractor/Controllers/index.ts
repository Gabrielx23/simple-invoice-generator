import { CreateContractorController } from './create-contractor.controller';
import { UpdateContractorController } from './update-contractor.controller';
import { DeleteContractorController } from './delete-contractor.controller';
import { GetContractorController } from './get-contractor.controller';
import { PaginateContractorsController } from './paginate-contractors.controller';

export const controllers = [
  CreateContractorController,
  UpdateContractorController,
  DeleteContractorController,
  GetContractorController,
  PaginateContractorsController,
];
