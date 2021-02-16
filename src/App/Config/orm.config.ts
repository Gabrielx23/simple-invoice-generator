import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { InvoiceEntity } from '../../Invoice/Domain/Entities/invoice.entity';
import { InvoiceRowEntity } from '../../Invoice/Domain/Entities/invoice-row.entity';

export const connectionOptions: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrationsRun: true,
  synchronize: false,
  logging: false,
  entities: [InvoiceEntity, InvoiceRowEntity],
  migrations: [
    join(
      __dirname,
      '../../Invoice/Infrastructure/Database/Migrations/*{.ts,.js}',
    ),
  ],
};
