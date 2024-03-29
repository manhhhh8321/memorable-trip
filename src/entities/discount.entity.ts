import { BaseModel } from 'src/base/base.entity';
import { Room } from 'src/entities/index';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Discount extends BaseModel {
  constructor(partial: Partial<Discount>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'text',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  dueDate: Date;

  @OneToMany((type) => RoomDiscount, (roomDiscount) => roomDiscount.discount, { cascade: true, eager: true })
  roomDiscount: RoomDiscount[];
}

@Entity()
export class RoomDiscount {
  @PrimaryColumn()
  roomId: number;

  @PrimaryColumn()
  discountId: number;

  @Column({
    type: 'numeric',
    nullable: false,
  })
  percentage: number;

  @ManyToOne((type) => Room, (room) => room.id)
  room: Room;

  @ManyToOne((type) => Discount, (discount) => discount.id)
  discount: Discount;
}
