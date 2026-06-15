import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductOptionService } from '../../../services/product-option.service';
import { ProductOption, OptionStatus } from '../../../models/product-option.model';

@Component({
  selector: 'app-product-option-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-option-list.component.html',
  styleUrl: './product-option-list.component.css',
})
export class ProductOptionListComponent implements OnInit {
  private optionService = inject(ProductOptionService);
  options = signal<ProductOption[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.optionService.getOptions().subscribe({
      next: (data) => {
        this.options.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.options.set([]);
        this.isLoading.set(false);
      },
    });
  }

  deleteOption(id: string): void {
    if (!confirm('Are you sure you want to delete this option?')) return;
    this.optionService.deleteOption(id).subscribe({
      error: (err) => {
        console.error('Delete failed:', err);
      },
    });
  }

  getStatusName(status: OptionStatus): string {
    return this.optionService.getStatusName(status);
  }

  getStatusColor(status: OptionStatus): string {
    return this.optionService.getStatusColor(status);
  }
}
