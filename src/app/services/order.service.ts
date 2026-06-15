import { Injectable } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private orders: Order[] = [
    {
      id: 1,
      order_id: '#ORD-001',
      customer: 'John Doe',
      customer_email: 'john@example.com',
      date: '2024-01-15',
      items: 3,
      total: 299.97,
      status: OrderStatus.Delivered,
      payment: 'Credit Card',
    },
    {
      id: 2,
      order_id: '#ORD-002',
      customer: 'Jane Smith',
      customer_email: 'jane@example.com',
      date: '2024-01-16',
      items: 1,
      total: 999.0,
      status: OrderStatus.Processing,
      payment: 'PayPal',
    },
    {
      id: 3,
      order_id: '#ORD-003',
      customer: 'Bob Johnson',
      customer_email: 'bob@example.com',
      date: '2024-01-17',
      items: 5,
      total: 449.95,
      status: OrderStatus.Dispatched,
      payment: 'Credit Card',
    },
    {
      id: 4,
      order_id: '#ORD-004',
      customer: 'Alice Brown',
      customer_email: 'alice@example.com',
      date: '2024-01-18',
      items: 2,
      total: 179.98,
      status: OrderStatus.Pending,
      payment: 'Bank Transfer',
    },
    {
      id: 5,
      order_id: '#ORD-005',
      customer: 'Charlie Wilson',
      customer_email: 'charlie@example.com',
      date: '2024-01-19',
      items: 1,
      total: 2499.0,
      status: OrderStatus.Delivered,
      payment: 'Credit Card',
    },
    {
      id: 6,
      order_id: '#ORD-006',
      customer: 'Diana Davis',
      customer_email: 'diana@example.com',
      date: '2024-01-20',
      items: 4,
      total: 598.96,
      status: OrderStatus.Cancelled,
      payment: 'PayPal',
    },
    {
      id: 7,
      order_id: '#ORD-007',
      customer: 'Edward Martinez',
      customer_email: 'edward@example.com',
      date: '2024-01-21',
      items: 2,
      total: 348.0,
      status: OrderStatus.Processing,
      payment: 'Credit Card',
    },
    {
      id: 8,
      order_id: '#ORD-008',
      customer: 'Fiona Clark',
      customer_email: 'fiona@example.com',
      date: '2024-01-22',
      items: 3,
      total: 449.97,
      status: OrderStatus.Dispatched,
      payment: 'Stripe',
    },
    {
      id: 9,
      order_id: '#ORD-009',
      customer: 'George Taylor',
      customer_email: 'george@example.com',
      date: '2024-01-23',
      items: 1,
      total: 89.0,
      status: OrderStatus.Delivered,
      payment: 'Credit Card',
    },
    {
      id: 10,
      order_id: '#ORD-010',
      customer: 'Hannah White',
      customer_email: 'hannah@example.com',
      date: '2024-01-24',
      items: 6,
      total: 789.94,
      status: OrderStatus.Pending,
      payment: 'PayPal',
    },
    {
      id: 11,
      order_id: '#ORD-011',
      customer: 'Ivan Harris',
      customer_email: 'ivan@example.com',
      date: '2024-01-25',
      items: 2,
      total: 598.0,
      status: OrderStatus.Delivered,
      payment: 'Bank Transfer',
    },
    {
      id: 12,
      order_id: '#ORD-012',
      customer: 'Julia Robinson',
      customer_email: 'julia@example.com',
      date: '2024-01-26',
      items: 1,
      total: 149.0,
      status: OrderStatus.Processing,
      payment: 'Stripe',
    },
  ];

  getOrders(): Order[] {
    return [...this.orders];
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  getStatusName(statusId: number): string {
    const names: Record<number, string> = {
      [OrderStatus.Delivered]: 'Delivered',
      [OrderStatus.Cancelled]: 'Cancelled',
      [OrderStatus.Processing]: 'Processing',
      [OrderStatus.Dispatched]: 'Dispatched',
      [OrderStatus.Pending]: 'Pending',
    };
    return names[statusId] || 'Unknown';
  }

  getStatusColor(statusId: number): string {
    const colors: Record<number, string> = {
      [OrderStatus.Delivered]: 'success',
      [OrderStatus.Cancelled]: 'danger',
      [OrderStatus.Processing]: 'warning',
      [OrderStatus.Dispatched]: 'info',
      [OrderStatus.Pending]: 'secondary',
    };
    return colors[statusId] || 'secondary';
  }
}
