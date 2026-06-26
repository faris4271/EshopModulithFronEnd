import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brand.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [RouterLink, ConfirmationDialogComponent],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.css',
})
export class BrandListComponent implements OnInit {
  private brandService = inject(BrandService);
  brands = signal<Brand[]>([]);
  isLoading = signal(true);
  isDeleteModalVisible = signal(false);
  brandToDeleteId = signal<string | null>(null);

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
    this.brandToDeleteId.set(id);
    this.isDeleteModalVisible.set(true);
  }

  confirmDelete(): void {
    const id = this.brandToDeleteId();
    if (id) {
      this.brandService.deleteBrand(id).subscribe({
        next: () => {
          this.loadBrands();
          this.closeDeleteModal();
        },
        error: () => this.closeDeleteModal(),
      });
    }
  }

  cancelDelete(): void {
    this.closeDeleteModal();
  }

  private closeDeleteModal(): void {
    this.isDeleteModalVisible.set(false);
    this.brandToDeleteId.set(null);
  }
}
