import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent {
  orderService = inject(OrderService);
  OrderStatus = OrderStatus;

  allOrders = this.orderService.getOrders();
  searchTerm = signal('');
  filterStatus = signal(-1);

  filteredOrders = computed(() => {
    let result = this.allOrders;
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(
        (o) =>
          o.order_id.toLowerCase().includes(search) ||
          o.customer.toLowerCase().includes(search) ||
          o.customer_email.toLowerCase().includes(search),
      );
    }
    const status = this.filterStatus();
    if (status >= 0) result = result.filter((o) => o.status === status);
    return result;
  });

  getStatusBadgeClass(status: number): string {
    const map: Record<number, string> = {
      [OrderStatus.Delivered]: 'bg-green-50 text-green-700 ring-1 ring-green-600/20',
      [OrderStatus.Cancelled]: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
      [OrderStatus.Processing]: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20',
      [OrderStatus.Dispatched]: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
      [OrderStatus.Pending]: 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20',
    };
    return map[status] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
  }
}
