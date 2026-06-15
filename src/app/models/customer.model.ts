export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  orders: number;
  total_spent: number;
  join_date: string;
  status: number;
  avatar?: string;
}

export enum CustomerStatus {
  Active = 1,
  Inactive = 2,
  Pending = 3,
}
