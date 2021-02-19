import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentTypeEnum } from '../Enum/payment-type.enum';
import { InvoiceRowEntity } from './invoice-row.entity';
import { ContractorEntity } from '../../../Contractor/Database/Entities/contractor.entity';
import { Type } from 'class-transformer';

@Entity('invoices')
@Unique(['number'])
export class InvoiceEntity extends BaseEntity {
  @ApiProperty({ example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'F/1/2021' })
  @Column('text')
  number: string;

  @ApiProperty({ example: 'Warsaw' })
  @Column('text')
  place: string;

  @ApiProperty({ example: '2021-08-10' })
  @Column('date')
  invoiceDate: Date;

  @ApiProperty({ example: '2021-08-10' })
  @Column('date', { nullable: true })
  deliveryDate: Date;

  @ApiProperty({ example: '2021-08-10' })
  @Column('date', { nullable: true })
  paymentDate: Date;

  @ApiProperty({ example: true })
  @Column('boolean')
  withVat: boolean;

  @ApiProperty({ example: '12.99' })
  @Column('text')
  total: string;

  @ApiProperty({ example: PaymentTypeEnum.bankTransfer })
  @Column('text')
  paymentType: PaymentTypeEnum;

  @ApiProperty({ example: 'John Doe' })
  @Column('text')
  createdBy: string;

  @ApiProperty({ example: [] })
  @OneToMany('InvoiceRowEntity', 'invoice')
  rows: InvoiceRowEntity[];

  @ApiProperty({ example: new ContractorEntity() })
  @ManyToOne('ContractorEntity', 'invoices')
  contractor: ContractorEntity;

  @ApiProperty({ example: '2020-08-10T05:59:36.708Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2020-08-10T05:59:36.708Z' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
