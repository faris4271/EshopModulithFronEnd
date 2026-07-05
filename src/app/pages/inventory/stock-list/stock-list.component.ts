import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormArray, FormControl, FormGroup } from '@angular/forms';
import { StockService } from '../../../services/stock.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { StockItem, AdjustStockDto } from '../../../models/stock.model';
import { Warehouse } from '../../../models/warehouse.model';
import { SmartTableParam } from '../../../models/SmartTableParam';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { StockHistoryModalComponent } from './stock-history-modal.component';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, StockHistoryModalComponent],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css',
})
export class StockListComponent implements OnInit {
  private stockService = inject(StockService);
  private warehouseService = inject(WarehouseService);

  // State signals
  allStocks = signal<StockItem[]>([]);
  warehouses = signal<Warehouse[]>([]);
  selectedWarehouseId = signal<string>('');
  filterProductName = signal('');
  filterSku = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  isLoadingStocks = signal(false);
  stocksError = signal<string | null>(null);
  isSaving = signal(false);

  selectedWarehouse = computed(() => 
    this.warehouses().find(w => w.id === this.selectedWarehouseId()) || { name: 'Unknown' }
  );

  // Modal signals
  showHistoryModal = signal(false);
  historyProductId = signal('');
  historyWarehouseId = signal('');
  historyProductName = signal('');

  // Helper
  Math = Math;

  // Reactive Form for bulk editing
  stockForm = new FormGroup({
    rows: new FormArray<FormGroup>(// Use FormGroup here to maintain type
      [] as any
    ),
  });


  private filterSubject = new Subject<{ name?: string; sku?: string }>();

  constructor() {
    this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => 
        prev.name === curr.name && prev.sku === curr.sku
      )
    ).subscribe(() => {
       this.currentPage.set(1);
       this.loadStocks();
     });
  }

  ngOnInit() {
    this.loadWarehouses();
  }

 

  loadWarehouses() {
    console.log('Loading warehouses...');
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        console.log('Warehouses loaded:', data);
        this.warehouses.set(data);
        if (data.length > 0) {
          this.selectedWarehouseId.set(data[0].id);
          this.loadStocks();
        } else {
          console.warn('No warehouses found. Stocks will not load automatically.');
        }
      },
      error: (err) => {
        console.error('Failed to load warehouses:', err);
      }
    });
  }

  loadStocks() {
    if (!this.selectedWarehouseId()) {
      return;
    }
    this.isLoadingStocks.set(true);
    const params: SmartTableParam = {
      pagination: {
        Page: this.currentPage(),
        PageSize: this.pageSize(),
        Start: (this.currentPage() - 1) * this.pageSize(),
      },
      search: {
        PredicateObject: {
          ProductName: this.filterProductName() || undefined,
          Sku: this.filterSku() || undefined,
          WarehouseId: this.selectedWarehouseId() || undefined,
        },
      },
    };

    console.log('Loading stocks with params:', params);
    this.stockService.getStocks(this.selectedWarehouseId(),params).subscribe({
      next: (result) => {
        console.log('Stocks loaded:', result);
        this.allStocks.set(result.data);
        this.totalRecords.set(result.total);
        this.buildFormArray(result.data);
        this.isLoadingStocks.set(false);
        this.stocksError.set(null);
      },
      error: (err) => {
        console.error('Failed to load stocks:', err);
        this.isLoadingStocks.set(false);
        this.stocksError.set('Failed to load stock records. Please try again.');
      }
    });
  }

  buildFormArray(stocks: StockItem[]) {
    const rows = this.stockForm.controls.rows;
    rows.clear();
    stocks.forEach(stock => {
      rows.push(new FormGroup({
        adjustedQuantity: new FormControl(0, { nonNullable: true }),
        note: new FormControl('', { nonNullable: true }),
      }));
    });
  }

  onWarehouseChange(id: string) {
    this.selectedWarehouseId.set(id);
    this.currentPage.set(1);
    this.loadStocks();
  }

  updateFilterProductName(value: string) {
    this.filterProductName.set(value);
    this.filterSubject.next({ name: value, sku: this.filterSku() });
  }

  updateFilterSku(value: string) {
    this.filterSku.set(value);
    this.filterSubject.next({ name: this.filterProductName(), sku: value });
  }

  saveChanges() {
    const dirtyRows: AdjustStockDto[] = [];
    const stocks = this.allStocks();
    const rowControls = this.stockForm.controls.rows.controls;

    stocks.forEach((stock, index) => {
      const control = rowControls[index];
      const adjustedQuantity = control.get('adjustedQuantity')?.value;
      const note = control.get('note')?.value;

      if (adjustedQuantity !== 0) {
        dirtyRows.push({
          stockId: stock.id,
          productId: stock.productId,
          warehouseId: stock.warehouseId,
          adjustedQuantity: adjustedQuantity,
          note: note,
        });
      }
    });

    if (dirtyRows.length === 0) return;

    this.isSaving.set(true);
    this.stockService.adjustStockBulk(dirtyRows).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.loadStocks();
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error('Save failed', err);
      }
    });
  }

  openHistory(productId: string, warehouseId: string, productName: string) {
    this.historyProductId.set(productId);
    this.historyWarehouseId.set(warehouseId);
    this.historyProductName.set(productName);
    this.showHistoryModal.set(true);
  }

  closeHistory() {
    this.showHistoryModal.set(false);
    this.historyProductId.set('');
    this.historyWarehouseId.set('');
    this.historyProductName.set('');
  }

  // Pagination logic
  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });

  get isFormDirty(): boolean {
    return this.stockForm.controls.rows.controls.some(control => 
      control.get('adjustedQuantity')?.value !== 0 || 
      control.get('note')?.value !== ''
    );
  }
}
