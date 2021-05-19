import { InvoiceRowEntity } from '../../Domain/Entities/invoice-row.entity';
import { InvoiceEntity } from '../../Domain/Entities/invoice.entity';
import { ApiProperty } from '@nestjs/swagger';

export class InvoiceDTO {
  @ApiProperty({ type: InvoiceEntity })
  data: Partial<InvoiceEntity>;

  @ApiProperty({ type: [InvoiceRowEntity] })
  rows: Array<InvoiceRowEntity>;

  @ApiProperty({ example: '1100.00' })
  total: string;

  @ApiProperty({ example: '1000.00' })
  totalWithoutVat: string;

  @ApiProperty({ example: '100.00' })
  totalVat: string;

  constructor(partial?: Partial<InvoiceDTO>) {
    if (partial) {
      this.data = partial.data;
      this.rows = partial.rows;
      this.total = partial.total;
      this.totalWithoutVat = partial.totalWithoutVat;
      this.totalVat = partial.totalVat;
    }
  }
}
