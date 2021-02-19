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

@Entity('contractors')
@Unique(['vatId', 'abbreviation'])
export class ContractorEntity extends BaseEntity {
  @ApiProperty({ example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Some Company Name' })
  @Column('text')
  name: string;

  @ApiProperty({ example: 'SomeCompName' })
  @Column('text')
  abbreviation: string;

  @ApiProperty({ example: 'ul. Kwitowa 1/1, 10-100 Warsaw' })
  @Column('text')
  address: string;

  @ApiProperty({ example: '1000000000' })
  @Column('text')
  vatId: string;

  @ApiProperty({ example: [] })
  @OneToMany('InvoiceEntity', 'contractor')
  invoices: InvoiceEntity[];

  @ApiProperty({ example: '2020-08-10T05:59:36.708Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2020-08-10T05:59:36.708Z' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
