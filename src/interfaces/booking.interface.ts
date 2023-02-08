export interface IBooking {
  roomId: number;
  customerId: number;
  checkin: string;
  checkout: string;
  note: string;
  bookType: string;
  ref: string;
}
