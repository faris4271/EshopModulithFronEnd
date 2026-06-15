import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent {
  private route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  private productService = inject(ProductService);

  order = signal(this.orderService.getOrderById(+(this.route.snapshot.paramMap.get('id') || 0)));
  orderItems = signal<any[]>([]);

  constructor() {
    this.productService.getProducts().subscribe(result => {
      this.orderItems.set(result.data.slice(0, this.order()?.items || 0));
    });
  }

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

  getStatusBgClass(status: number): string {
    const map: Record<number, string> = {
      [OrderStatus.Delivered]: 'bg-green-500',
      [OrderStatus.Cancelled]: 'bg-red-500',
      [OrderStatus.Processing]: 'bg-yellow-500',
      [OrderStatus.Dispatched]: 'bg-blue-500',
      [OrderStatus.Pending]: 'bg-gray-400',
    };
    return map[status] || 'bg-gray-400';
  }
}
