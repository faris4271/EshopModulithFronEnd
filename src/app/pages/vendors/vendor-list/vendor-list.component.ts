import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../../services/vendor.service';
import { VendorItem } from '../../../models/vendor.model';
import { SmartTableParam } from '../../../models/SmartTableParam';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [CommonModule,RouterModule, PaginationComponent, ConfirmationDialogComponent],
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css',
})
export class VendorListComponent {
  vendorService = inject(VendorService);

  Math = Math;

  allVendors = signal<VendorItem[]>([]);
  searchTerm = signal('');
  filterIsActive = signal<boolean | null>(null);
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  sortColumn = signal('Name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  selectedIds = signal<Set<string>>(new Set());
  vendorToDelete = signal<VendorItem | null>(null);
  isBulkDelete = signal(false);

  private searchTerm$ = new Subject<string>();

  constructor() {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage.set(1);
      this.loadVendors();
    });

    this.loadVendors();
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.searchTerm$.next(value);
  }

  loadVendors() {
    const params: SmartTableParam = {
       pagination: {
         Page: this.currentPage(),
         PageSize: this.pageSize(),
         Start: (this.currentPage() - 1) * this.pageSize(),
       },
      sort: {
        Predicate: this.sortColumn(),
        Reverse: this.sortDirection() === 'desc',
      },
      search: {
        PredicateObject: {
          Name: this.searchTerm() || undefined,
          IsActive: this.filterIsActive() ?? undefined,
          CreatedOn: (this.dateFrom() || this.dateTo()) ? {
            before: this.dateTo() || undefined,
            after: this.dateFrom() || undefined,
          } : undefined,
        },
      },
    };

    if (params.search?.PredicateObject) {
      Object.keys(params.search.PredicateObject).forEach(key => {
        if (params.search!.PredicateObject![key] === undefined) {
          delete params.search!.PredicateObject![key];
        }
      });
    }

    this.vendorService.getVendors(params).subscribe(result => {
      this.allVendors.set(result.data);
      this.totalRecords.set(result.total);
    });
  }

  allSelected = computed(() => {
    const ids = this.selectedIds();
    const vendors = this.allVendors();
    return vendors.length > 0 && vendors.every((v) => ids.has(v.id));
  });

  toggleSelect(id: string): void {
    this.selectedIds.update((ids) => {
      const newSet = new Set(ids);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  toggleAllSelect(): void {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      const allIds = this.allVendors().map(v => v.id);
      this.selectedIds.set(new Set(allIds));
    }
  }

  deleteVendor(vendor: VendorItem): void {
    this.vendorToDelete.set(vendor);
    this.isBulkDelete.set(false);
  }

  deleteSelected(): void {
    if (this.selectedIds().size > 0) {
      this.isBulkDelete.set(true);
      this.vendorToDelete.set(null);
    }
  }

  confirmDelete(): void {
    if (this.isBulkDelete()) {
      const ids = Array.from(this.selectedIds());
      ids.forEach(id => {
        this.vendorService.deleteVendor(id).subscribe(() => {
          this.loadVendors();
        });
      });
      this.selectedIds.set(new Set());
    } else {
      const vendor = this.vendorToDelete();
      if (vendor) {
        this.vendorService.deleteVendor(vendor.id).subscribe(() => {
          this.loadVendors();
        });
      }
    }
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.vendorToDelete.set(null);
    this.isBulkDelete.set(false);
  }
}