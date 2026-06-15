import { Injectable } from '@angular/core';
import { Customer, CustomerStatus } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private customers: Customer[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-234-567-8901',
      country: 'United States',
      orders: 12,
      total_spent: 4599.88,
      join_date: '2023-01-15',
      status: CustomerStatus.Active,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+44-20-1234-5678',
      country: 'United Kingdom',
      orders: 8,
      total_spent: 2349.92,
      join_date: '2023-03-22',
      status: CustomerStatus.Active,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1-345-678-9012',
      country: 'Canada',
      orders: 5,
      total_spent: 899.95,
      join_date: '2023-05-10',
      status: CustomerStatus.Active,
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '+61-2-3456-7890',
      country: 'Australia',
      orders: 15,
      total_spent: 6789.85,
      join_date: '2022-11-08',
      status: CustomerStatus.Active,
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      phone: '+49-30-1234567',
      country: 'Germany',
      orders: 3,
      total_spent: 2499.0,
      join_date: '2023-07-19',
      status: CustomerStatus.Pending,
    },
    {
      id: 6,
      name: 'Diana Davis',
      email: 'diana@example.com',
      phone: '+33-1-2345-6789',
      country: 'France',
      orders: 7,
      total_spent: 1899.93,
      join_date: '2023-02-14',
      status: CustomerStatus.Inactive,
    },
    {
      id: 7,
      name: 'Edward Martinez',
      email: 'edward@example.com',
      phone: '+34-91-234-5678',
      country: 'Spain',
      orders: 9,
      total_spent: 3459.91,
      join_date: '2022-09-05',
      status: CustomerStatus.Active,
    },
    {
      id: 8,
      name: 'Fiona Clark',
      email: 'fiona@example.com',
      phone: '+353-1-234-5678',
      country: 'Ireland',
      orders: 2,
      total_spent: 449.98,
      join_date: '2023-08-30',
      status: CustomerStatus.Pending,
    },
    {
      id: 9,
      name: 'George Taylor',
      email: 'george@example.com',
      phone: '+81-3-1234-5678',
      country: 'Japan',
      orders: 11,
      total_spent: 5239.89,
      join_date: '2022-12-20',
      status: CustomerStatus.Active,
    },
    {
      id: 10,
      name: 'Hannah White',
      email: 'hannah@example.com',
      phone: '+65-1234-5678',
      country: 'Singapore',
      orders: 6,
      total_spent: 1789.94,
      join_date: '2023-04-11',
      status: CustomerStatus.Active,
    },
  ];

  getCustomers(): Customer[] {
    return [...this.customers];
  }

  getCustomerById(id: number): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  getStatusName(statusId: number): string {
    const names: Record<number, string> = {
      [CustomerStatus.Active]: 'Active',
      [CustomerStatus.Inactive]: 'Inactive',
      [CustomerStatus.Pending]: 'Pending',
    };
    return names[statusId] || 'Unknown';
  }

  getStatusColor(statusId: number): string {
    const colors: Record<number, string> = {
      [CustomerStatus.Active]: 'success',
      [CustomerStatus.Inactive]: 'danger',
      [CustomerStatus.Pending]: 'warning',
    };
    return colors[statusId] || 'secondary';
  }
}
