export const mainConfig = () => ({
  port: Number(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET,
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [],
  },
});
