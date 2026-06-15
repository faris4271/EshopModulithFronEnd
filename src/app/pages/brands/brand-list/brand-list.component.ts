import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brand.model';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.css',
})
export class BrandListComponent implements OnInit {
  private brandService = inject(BrandService);
  brands = signal<Brand[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading.set(true);
    this.brandService.getBrands().subscribe({
      next: (data) => {
        this.brands.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.brands.set([]);
        this.isLoading.set(false);
      },
    });
  }

  deleteBrand(id: string): void {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    this.brandService.deleteBrand(id).subscribe({
      next: () => this.loadBrands(),
      error: () => {},
    });
  }
}
