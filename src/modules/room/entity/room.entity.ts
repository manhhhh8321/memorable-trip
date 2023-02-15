import { BaseModel } from 'src/base/base.entity';
import { RoomType } from 'src/enums/user.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class Room extends BaseModel {
  constructor(partial: Partial<Room>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    type: 'enum',
    enum: RoomType,
  })
  roomType: RoomType;

  @Column('text')
  roomName: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  isAvailable: boolean;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  roomSize: number;

  @Column('numeric')
  price: number;
}
