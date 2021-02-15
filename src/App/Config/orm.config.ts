import { join } from 'path';
import { ConnectionOptions } from 'typeorm';

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
  entities: [join(__dirname, '../../*{.entity.ts,.entity.js}')],
  migrations: [join(__dirname, '../../*{Migration.ts, Migration.js}')],
};
