import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { InvoiceEntity } from '../../Invoice/Domain/Entities/invoice.entity';
import { InvoiceRowEntity } from '../../Invoice/Domain/Entities/invoice-row.entity';
import { ContractorEntity } from '../../Contractor/Database/Entities/contractor.entity';
import { CompanyEntity } from '../../Company/Database/Entities/company.entity';

export const connectionOptions: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrationsRun: true,
  synchronize: false,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  logging: ['error', 'query', 'schema'],
  entities: [InvoiceEntity, InvoiceRowEntity, ContractorEntity, CompanyEntity],
  migrations: [
    join(__dirname, '../../Contractor/Database/Migrations/*{.ts,.js}'),
    join(__dirname, '../../Company/Database/Migrations/*{.ts,.js}'),
    join(
      __dirname,
      '../../Invoice/Infrastructure/Database/Migrations/*{.ts,.js}',
    ),
  ],
};
