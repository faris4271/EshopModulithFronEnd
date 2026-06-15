import { Component, inject, signal, computed } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { CustomerStatus } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
})
export class CustomerListComponent {
  customerService = inject(CustomerService);
  CustomerStatus = CustomerStatus;

  allCustomers = this.customerService.getCustomers();
  searchTerm = signal('');
  filterStatus = signal(-1);

  filteredCustomers = computed(() => {
    let result = this.allCustomers;
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.country.toLowerCase().includes(search),
      );
    }
    const status = this.filterStatus();
    if (status >= 0) result = result.filter((c) => c.status === status);
    return result;
  });

  getStatusBadgeClass(status: number): string {
    const map: Record<number, string> = {
      [CustomerStatus.Active]: 'bg-green-50 text-green-700 ring-1 ring-green-600/20',
      [CustomerStatus.Inactive]: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
      [CustomerStatus.Pending]: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20',
    };
    return map[status] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
  }
}
