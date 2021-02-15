import { connectionOptions } from './orm.config';

export const mainConfig = () => ({
  port: 3000,
  database: connectionOptions,
});
