import { BookType } from 'src/enums/user.enum';

export interface IBooking {
  id: number;
  roomId: number;
  customerId: number;
  checkin: string;
  checkout: string;
  note: string;
  bookType: BookType;
  ref: string;
}
