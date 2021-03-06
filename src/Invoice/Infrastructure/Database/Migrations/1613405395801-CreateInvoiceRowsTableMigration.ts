import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvoiceRowsTableMigration1613405395801
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE invoiceRows (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount INT NOT NULL,
            unit VARCHAR(10) NULL,
            price VARCHAR(255) NOT NULL,
            vat INT(2) NULL,
            invoiceId VARCHAR(255) NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (invoiceId) REFERENCES invoices(id) ON DELETE CASCADE 
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE invoiceRows
        DROP FOREIGN KEY FK_invoice;
      `);

    await queryRunner.query(`
        DROP TABLE invoiceRows
    `);
  }
}
