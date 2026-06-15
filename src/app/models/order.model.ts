export interface Order {
  id: number;
  order_id: string;
  customer: string;
  customer_email: string;
  date: string;
  items: number;
  total: number;
  status: number;
  payment: string;
  shipping?: string;
  address?: string;
}

export enum OrderStatus {
  Delivered = 1,
  Cancelled = 2,
  Processing = 3,
  Dispatched = 4,
  Pending = 5,
}
