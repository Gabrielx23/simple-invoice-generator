import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvoicesTableMigration1613401878965
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE invoices (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            number VARCHAR(255) UNIQUE NOT NULL,
            place VARCHAR(255) NOT NULL,
            invoiceDate DATE NOT NULL,
            deliveryDate DATE NULL,
            total VARCHAR(255) NOT NULL,
            paymentDate DATE NULL,
            withVat INTEGER(1) DEFAULT 0,
            paymentType VARCHAR(255) NOT NULL,
            createdBy VARCHAR(255) NOT NULL,
            companyId VARCHAR(255) NOT NULL,
            FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
            contractorId VARCHAR(255) NOT NULL,
            FOREIGN KEY (contractorId) REFERENCES contractors(id) ON DELETE CASCADE,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE invoices
    `);
  }
}
