import { Repository, EntityRepository } from 'typeorm';
import { InvoiceRowEntity } from '../../../Domain/Entities/invoice-row.entity';

@EntityRepository(InvoiceRowEntity)
export class InvoiceRowOrmRepository extends Repository<InvoiceRowEntity> {}
