import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContractorsTableMigration1613401878964
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE contractors (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            name VARCHAR(50) NOT NULL,
            abbreviation VARCHAR(15) NOT NULL UNIQUE,
            address VARCHAR(150) NOT NULL,
            vatId VARCHAR(10) NOT NULL UNIQUE,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE contractors
    `);
  }
}
