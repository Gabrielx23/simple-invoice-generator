import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceEntity } from '../../../Invoice/Domain/Entities/invoice.entity';

@Entity('companies')
@Unique(['vatId'])
export class CompanyEntity extends BaseEntity {
  @ApiProperty({ example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Some Company Name' })
  @Column('text')
  name: string;

  @ApiProperty({ example: '11111111111111111111111111' })
  @Column('text')
  accountNumber: string;

  @ApiProperty({ example: 'Pekao' })
  @Column('text')
  accountProvider: string;

  @ApiProperty({ example: '<svg></svg>' })
  @Column('text')
  logo: string;

  @ApiProperty({ example: 'ul. Kwitowa 1/1, 10-100 Warsaw' })
  @Column('text')
  address: string;

  @ApiProperty({ example: '1000000000' })
  @Column('text')
  vatId: string;

  @ApiProperty({ example: [] })
  @OneToMany('InvoiceEntity', 'company')
  invoices: InvoiceEntity[];

  @ApiProperty({ example: '2020-08-10T05:59:36.708Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2020-08-10T05:59:36.708Z' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
