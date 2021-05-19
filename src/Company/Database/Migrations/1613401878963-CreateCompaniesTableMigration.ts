import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompaniesTableMigration1613401878963
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE companies (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            name VARCHAR(50) NOT NULL,
            accountNumber VARCHAR(26),
            accountProvider VARCHAR(100),
            logo TEXT(5000),
            address VARCHAR(150) NOT NULL,
            vatId VARCHAR(10) NOT NULL UNIQUE,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE companies
    `);
  }
}
