import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CartPriceRuleService } from '../../../services/cart-price-rule.service';
import { CartPriceRuleItem } from '../../../models/cart-price-rule.model';
import { SmartTableParam } from '../../../models/SmartTableParam';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-cart-price-rule-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, PaginationComponent, ConfirmationDialogComponent],
  templateUrl: './cart-price-rule-list.component.html',
})
export class CartPriceRuleListComponent {
  cartPriceRuleService = inject(CartPriceRuleService);
  private toast = inject(ToastService);

  Math = Math;

  allRules = signal<CartPriceRuleItem[]>([]);
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalRecords = signal(0);
  ruleToDelete = signal<CartPriceRuleItem | null>(null);

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage.set(1);
      this.loadRules();
    });

    this.loadRules();
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  loadRules() {
    const params: SmartTableParam = {
      pagination: {
        Page: this.currentPage(),
        PageSize: this.pageSize(),
        Start: (this.currentPage() - 1) * this.pageSize(),
      },
      search: this.searchTerm() ? { PredicateObject: { name: this.searchTerm() } } : undefined,
    };

    this.cartPriceRuleService.getCartPriceRules(params).subscribe(result => {
      this.allRules.set(result.data);
      this.totalRecords.set(result.total);
    });
  }

  toggleStatus(id: string): void {
    // Optimistic UI update
    this.allRules.update(rules =>
      rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
    );
    this.cartPriceRuleService.toggleCartPriceRuleStatus(id).subscribe({
      error: () => this.loadRules()
    });
  }

  deleteRule(rule: CartPriceRuleItem): void {
    this.ruleToDelete.set(rule);
  }

  confirmDelete(): void {
    const rule = this.ruleToDelete();
    if (rule) {
      this.cartPriceRuleService.deleteCartPriceRule(rule.id).subscribe({
        next: () => {
          this.toast.success('Cart price rule deleted successfully');
          this.loadRules();
          this.cancelDelete();
        },
        error: () => {
          this.toast.error('Failed to delete cart price rule');
          this.cancelDelete();
        },
      });
    }
  }

  cancelDelete(): void {
    this.ruleToDelete.set(null);
  }
}