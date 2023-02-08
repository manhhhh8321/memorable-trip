export interface IPayment {
  id: number;
  bookingRef: string;
  paymentType: string;
  status: string;
  completedAt: string;
}
