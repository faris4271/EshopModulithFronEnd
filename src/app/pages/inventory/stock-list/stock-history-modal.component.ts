import { Component, input, model, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService } from '../../../services/stock.service';
import { StockHistoryEntry } from '../../../models/stock.model';

@Component({
  selector: 'app-stock-history-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-history-modal.component.html',
})
export class StockHistoryModalComponent {
  private stockService = inject(StockService);

  productId = input.required<string>();
  warehouseId = input.required<string>();
  productName = input.required<string>();
  visible = model<boolean>(false);

  history = signal<StockHistoryEntry[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.loadHistory();
      }
    });
  }

  loadHistory() {
    this.isLoading.set(true);
    this.error.set(null);
    this.stockService.getStockHistoryByProduct(this.productId(), this.warehouseId()).subscribe({
      next: (data) => {
        this.history.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load stock history.');
        this.isLoading.set(false);
      },
    });
  }

  close() {
    this.visible.set(false);
  }
}
