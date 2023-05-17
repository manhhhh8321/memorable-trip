import { BaseModel } from 'src/base/base.entity';
import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity()
export class Wishlist extends BaseModel {
  constructor(partial: Partial<Wishlist>) {
    super();
    Object.assign(this, partial);
  }

  @ManyToOne((type) => User, (user) => user.wishlist, { eager: true })
  user: User;

  @ManyToOne((type) => Room, (room) => room.wishlist, { eager: true })
  room: Room;
}
