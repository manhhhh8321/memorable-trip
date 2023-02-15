import { BaseModel } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Discount extends BaseModel {
  constructor(partial: Partial<Discount>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'numeric',
    nullable: true,
  })
  percentage: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dueDate: string;
}
