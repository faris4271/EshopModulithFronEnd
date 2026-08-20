import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaxClassService } from '../../../services/tax-class.service';
import { TaxClass } from '../../../models/tax-class.model';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { SmartTableParam } from '../../../models/SmartTableParam';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-tax-class-list',
  standalone: true,
  imports: [RouterLink, CommonModule, ConfirmationDialogComponent],
  templateUrl: './tax-class-list.component.html',
  styleUrl: './tax-class-list.component.css',
})
export class TaxClassListComponent implements OnInit {
  private taxClassService = inject(TaxClassService);

  Math = Math;

  allTaxClasses = signal<TaxClass[]>([]);
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  taxClassToDelete = signal<TaxClass | null>(null);

  private searchTerm$ = new Subject<string>();

  ngOnInit(): void {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage.set(1);
      this.loadTaxClasses();
    });

    this.loadTaxClasses();
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.searchTerm$.next(value);
  }

  loadTaxClasses(): void {
    const params: SmartTableParam = {
      pagination: {
        Page: this.currentPage(),
        PageSize: this.pageSize(),
        Start: (this.currentPage() - 1) * this.pageSize(),
      },
      search: {
        PredicateObject: {
          Name: this.searchTerm() || undefined,
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

    this.taxClassService.getTaxClasses(params).subscribe((result) => {
      this.allTaxClasses.set(result.data);
      this.totalRecords.set(result.total);
    });
  }

  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));
  paginatedTaxClasses = computed(() => this.allTaxClasses());

  deleteTaxClass(taxClass: TaxClass): void {
    this.taxClassToDelete.set(taxClass);
  }

  cancelDelete(): void {
    this.taxClassToDelete.set(null);
  }

  confirmDelete(): void {
    const taxClass = this.taxClassToDelete();
    if (taxClass) {
      this.taxClassService.deleteTaxClass(taxClass.id).subscribe(() => {
        this.loadTaxClasses();
        this.cancelDelete();
      });
    }
  }
}

