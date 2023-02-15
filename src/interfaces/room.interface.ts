import { RoomType } from 'src/enums/user.enum';

export interface IRoom {
  id: number;
  ownerId: number;
  propertyId: number;
  roomType: RoomType;
  roomName: string;
  isAvailable: boolean;
  roomSize: number;
  price: number;
  capacity: number;
}
