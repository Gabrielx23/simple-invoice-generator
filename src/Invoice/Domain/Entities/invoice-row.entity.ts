import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceRowUnitEnum } from '../Enum/invoice-row-unit.enum';
import { InvoiceEntity } from './invoice.entity';

@Entity('invoiceRows')
export class InvoiceRowEntity extends BaseEntity {
  @ApiProperty({ example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Outsourcing IT' })
  @Column('text')
  title: string;

  @ApiProperty({ example: 1 })
  @Column('number')
  amount: number;

  @ApiProperty({ example: InvoiceRowUnitEnum.piece })
  @Column('text', { nullable: true })
  unit: InvoiceRowUnitEnum;

  @ApiProperty({ example: '12.99' })
  @Column('text')
  price: string;

  @ApiProperty({ example: 1 })
  @Column('number', { nullable: true })
  vat: number;

  @ManyToOne('InvoiceEntity', 'rows')
  invoice: InvoiceEntity;

  @ApiProperty({ example: '2020-08-10T05:59:36.708Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2020-08-10T05:59:36.708Z' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
