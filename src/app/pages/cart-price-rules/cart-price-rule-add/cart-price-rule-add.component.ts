import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartPriceRuleService } from '../../../services/cart-price-rule.service';
import { ProductService } from '../../../services/product.service';
import { ToastService } from '../../../services/toast.service';
import { 
  CartRuleDto, 
  CartRuleProduct, 
  RULE_TO_APPLY_OPTIONS 
} from '../../../models/cart-price-rule.model';
import { ProductItem } from '../../../models/product.model';
import { ProductSelectorComponent } from './product-selector.component';

@Component({
  selector: 'app-cart-price-rule-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductSelectorComponent],
  templateUrl: './cart-price-rule-add.component.html',
  styles: []
})
export class CartPriceRuleAddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cartPriceRuleService = inject(CartPriceRuleService);
  private productService = inject(ProductService);
  private toast = inject(ToastService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  RULE_TO_APPLY_OPTIONS = RULE_TO_APPLY_OPTIONS;

  isEditing = signal(false);
  isSubmitting = signal(false);
  isSelectorOpen = signal(false);
  activeTab = signal<'rule' | 'products'>('rule');
  selectedProducts = signal<CartRuleProduct[]>([]);

  tabs = [
    { key: 'rule' as const, label: 'Add Rule' },
    { key: 'products' as const, label: 'Add Product' }
  ];

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    isActive: [true],
    startOn: ['', Validators.required],
    endOn: ['', Validators.required],
    isCouponRequired: [false],
    couponCode: [''],
    ruleToApply: ['percentage', Validators.required],
    discountAmount: [0, [Validators.min(0)]],
    maxDiscountAmount: [0, [Validators.min(0)]],
    discountStep: [0, [Validators.min(0)]],
    usageLimitPerCoupon: [0, [Validators.min(0)]],
    usageLimitPerCustomer: [0, [Validators.min(0)]],
  });

  selectedProductsIds = computed(() => this.selectedProducts().map(p => p.id));

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.loadCartPriceRule(id);
    }
  }

  loadCartPriceRule(id: string) {
    this.cartPriceRuleService.getCartPriceRule(id).subscribe({
      next: (dto) => {
        this.patchForm(dto);
        this.selectedProducts.set(dto.products || []);
      },
      error: () => this.toast.error('Failed to load cart price rule')
    });
  }

  patchForm(dto: CartRuleDto) {
    this.form.patchValue({
      ...dto,
      startOn: this.toDatetimeLocal(dto.startOn),
      endOn: this.toDatetimeLocal(dto.endOn),
    });
  }

  toDatetimeLocal(iso: string): string {
    if (!iso) return '';
    return iso.slice(0, 16); // Simple slice for YYYY-MM-DDTHH:mm
  }

  toIso(value: string): string {
    if (!value) return '';
    return new Date(value).toISOString();
  }

  toggleProduct(product: ProductItem) {
    const current = this.selectedProducts();
    const exists = current.some(p => p.id === product.id);
    
    if (exists) {
      this.selectedProducts.set(current.filter(p => p.id !== product.id));
    } else {
      this.selectedProducts.set([...current, { 
        id: product.id, 
        name: product.name, 
        isPublished: product.isPublished 
      }]);
    }
  }

  removeProduct(id: string) {
    this.selectedProducts.set(this.selectedProducts().filter(p => p.id !== id));
  }

  openSelector() {
    this.isSelectorOpen.set(true);
  }

  closeSelector() {
    this.isSelectorOpen.set(false);
  }

  isFieldInvalid(name: string) {
    const control = this.form.get(name);
    return control?.invalid && (control?.touched || this.form.touched);
  }

  getErrorMessage(name: string): string {
    const control = this.form.get(name);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('minlength')) return 'Minimum 2 characters required';
    if (control?.hasError('min')) return 'Value cannot be negative';
    return '';
  }

  onSubmit() {
    if (this.form.value.isCouponRequired) {
      this.form.get('couponCode')?.setValidators([Validators.required]);
    } else {
      this.form.get('couponCode')?.clearValidators();
    }
    this.form.get('couponCode')?.updateValueAndValidity();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.activeTab.set('rule');
      this.toast.error('Please fill all required fields');
      return;
    }

    this.isSubmitting.set(true);
    const dto: CartRuleDto = {
      ...this.form.value,
      startOn: this.toIso(this.form.value.startOn),
      endOn: this.toIso(this.form.value.endOn),
      products: this.selectedProducts(),
    };

    const request = this.isEditing() 
      ? this.cartPriceRuleService.updateCartPriceRule(this.route.snapshot.paramMap.get('id')!, dto)
      : this.cartPriceRuleService.createCartPriceRule(dto);

    request.subscribe({
      next: () => {
        this.toast.success(this.isEditing() ? 'Rule updated successfully' : 'Rule created successfully');
        this.router.navigate(['/promotions/cart-price-rules']);
      },
      error: () => {
        this.toast.error('An error occurred while saving the rule');
        this.isSubmitting.set(false);
      }
    });
  }
}
