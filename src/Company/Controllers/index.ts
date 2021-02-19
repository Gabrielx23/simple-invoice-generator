import { CreateCompanyController } from './create-company.controller';
import { UpdateCompanyController } from './update-company.controller';
import { DeleteCompanyController } from './delete-company.controller';
import { GetCompanyController } from './get-company.controller';
import { PaginateCompaniesController } from './paginate-companies.controller';

export const controllers = [
  CreateCompanyController,
  UpdateCompanyController,
  DeleteCompanyController,
  GetCompanyController,
  PaginateCompaniesController,
];
