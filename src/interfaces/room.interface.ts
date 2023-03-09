import { RoomType } from 'src/enums/user.enum';

export interface IRoom {
  id: number;
  ownerId: number;
  roomType: RoomType;
  roomName: string;
  isAvailable: boolean;
  roomSize: number;
  price: number;
}

export interface IRoomDiscount {
  roomId: number;
  discountId: number;
  percents: number;
}

interface IJsonRoom {
  id: number;
  name: string;
  host_id: number;
  room_type: string;
  minimum_nights: number;
  availability_365: number;
  column_10: number;
}
