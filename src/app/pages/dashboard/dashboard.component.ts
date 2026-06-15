import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { ProductStock, ProductStatus } from '../../models/product.model';
import { OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  productService = inject(ProductService);
  orderService = inject(OrderService);
  customerService = inject(CustomerService);

  products = signal<any[]>([]);
  orders = this.orderService.getOrders() || [];
  customers = this.customerService.getCustomers() || [];

  constructor() {
    this.productService.getProducts().subscribe(result => {
      this.products.set(result.data);
    });
  }

  inStockCount = computed(() => this.products().filter((p) => p.stock === ProductStock.In_Stock).length);

  recentOrders = this.orders.slice(0, 5);

  topProducts = computed(() => [...this.products()].sort((a, b) => b.qty - a.qty).slice(0, 5));

  orderBreakdown = this.getOrderBreakdown();
  productBreakdown = computed(() => this.getProductBreakdown());

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

  private getOrderBreakdown() {
    const orders = this.orders || [];
    const total = orders.length;
    const statuses = [
      { status: OrderStatus.Delivered, label: 'Delivered', barClass: 'bg-green-500' },
      { status: OrderStatus.Processing, label: 'Processing', barClass: 'bg-yellow-500' },
      { status: OrderStatus.Dispatched, label: 'Dispatched', barClass: 'bg-blue-500' },
      { status: OrderStatus.Pending, label: 'Pending', barClass: 'bg-gray-400' },
      { status: OrderStatus.Cancelled, label: 'Cancelled', barClass: 'bg-red-500' },
    ];
    return statuses.map((s) => {
      const count = orders.filter((o) => o.status === s.status).length;
      return { ...s, count, percent: total ? (count / total) * 100 : 0 };
    });
  }

  private getProductBreakdown() {
    const products = this.products() || [];
    const total = products.length;
    const statuses = [
      { status: ProductStatus.Publish, label: 'Published', barClass: 'bg-green-500' },
      { status: ProductStatus.Scheduled, label: 'Scheduled', barClass: 'bg-yellow-500' },
      { status: ProductStatus.Inactive, label: 'Inactive', barClass: 'bg-red-500' },
    ];
    return statuses.map((s) => {
      const count = products.filter((p) => p.status === s.status).length;
      return { ...s, count, percent: total ? (count / total) * 100 : 0 };
    });
  }
}
