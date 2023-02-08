export interface IBooking {
  id: number;
  ownerId: number;
  address: string;
  amenities: string[];
  isAvailable: boolean;
  roomType: string;
  roomSize: number;
  price: number;
  capacity: number;
}
