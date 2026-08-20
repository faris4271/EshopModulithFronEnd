import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormGroup,} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { CategoryService } from '../../../services/category.service';
import { TaxClassService } from '../../../services/tax-class.service';
import { ProductAttributeService } from '../../../services/product-attribute.service';
import { ProductOptionService } from '../../../services/product-option.service';
import { Brand } from '../../../models/brand.model';
import { Category } from '../../../models/category.model';
import { TaxClass } from '../../../models/tax-class.model';
import { ProductAttribute } from '../../../models/product-attribute.model';
import { ProductOption } from '../../../models/product-option.model';
import { ToastService } from '../../../services/toast.service';
import { ProductFormService } from './services/product-form.service';
import { ProductGeneralTabComponent } from './tabs/product-general-tab/product-general-tab.component';
import { ProductAttributesTabComponent } from './tabs/product-attributes-tab/product-attributes-tab.component';
import { ProductPricingTabComponent } from './tabs/product-pricing-tab/product-pricing-tab.component';
import { ProductInventoryTabComponent } from './tabs/product-inventory-tab/product-inventory-tab.component';
import { ProductMediaTabComponent } from './tabs/product-media-tab/product-media-tab.component';
import { ProductVariationsTabComponent } from './tabs/product-variations-tab/product-variations-tab.component';
import { ProductSeoTabComponent } from './tabs/product-seo-tab/product-seo-tab.component';
import { ProductCarouselTabComponent } from './tabs/product-carousel-tab/product-carousel-tab.component';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ProductGeneralTabComponent,
    ProductAttributesTabComponent,
    ProductPricingTabComponent,
    ProductInventoryTabComponent,
    ProductMediaTabComponent,
    ProductVariationsTabComponent,
    ProductSeoTabComponent,
    ProductCarouselTabComponent,
  ],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css',
})
export class ProductAddComponent implements OnInit {
  private brandService = inject(BrandService);
  private categoryService = inject(CategoryService);
  private taxClassService = inject(TaxClassService);
  private productAttributeService = inject(ProductAttributeService);
  private productOptionService = inject(ProductOptionService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  router = inject(Router);
  
  formService = inject(ProductFormService);

  brands = signal<Brand[]>([]);
  categories = signal<Category[]>([]);
  taxClasses = signal<TaxClass[]>([]);
  availableAttributes = signal<ProductAttribute[]>([]);
  availableOptions = signal<ProductOption[]>([]);
  
  isEditing = signal(false);
  isSubmitting = signal(false);
  activeTab = signal<'general' | 'attributes' | 'pricing' | 'inventory' | 'media' | 'variations' | 'seo' | 'carousel'>(
    'general',
  );

  tabs = [
    { key: 'general' as const, label: 'General Info' },
    { key: 'attributes' as const, label: 'Attributes & Templates' },
    { key: 'pricing' as const, label: 'Pricing' },
    { key: 'inventory' as const, label: 'Inventory' },
    { key: 'media' as const, label: 'Media' },
    { key: 'variations' as const, label: 'Variations' },
    { key: 'carousel' as const, label: 'Carousel & Related' },
    { key: 'seo' as const, label: 'SEO' },
  ];


  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
    }
  }

  ngOnInit(): void {
    // When entering add mode we must clear any stale state left by a previous edit.
    if (!this.isEditing()) {
      this.formService.resetForm();
    }
    this.brandService.getBrands().subscribe({
      next: (data) => this.brands.set(data),
      error: (err) => console.error('Failed to load brands:', err),
    });
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Failed to load categories:', err),
    });
    this.taxClassService.getTaxClassList().subscribe({
      next: (data) => this.taxClasses.set(data),
      error: (err) => console.error('Failed to load tax classes:', err),
    });
    this.productAttributeService.getAttributes().subscribe({
      next: (data) => this.availableAttributes.set(data),
      error: (err) => console.error('Failed to load attributes:', err),
    });
    this.productOptionService.getOptions().subscribe({
      next: (data) => this.availableOptions.set(data),
      error: (err) => console.error('Failed to load options:', err),
    });
    // Load product data when editing
    if (this.isEditing()) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.formService.loadProduct(id);
      }
    }
  }

  onSubmit(): void {
    if (this.formService.masterForm.invalid) {
      this.formService.masterForm.markAllAsTouched();
      const firstInvalidTab = this.findFirstInvalidTab();
      if (firstInvalidTab) {
        this.activeTab.set(firstInvalidTab as any);
        this.toastService.error(`Please correct the errors in the ${firstInvalidTab} tab.`);
      }
      return;
    }
    this.formService.submitFullProduct(this.isSubmitting);
  }

  private findFirstInvalidTab(): string | null {
    const form = this.formService.masterForm;

    const generalGroup = form.get('generalInfo') as FormGroup;
    if (generalGroup) {
      const otherControlsInvalid = Object.keys(generalGroup.controls)
        .filter((key) => key !== 'attributes')
        .some((key) => generalGroup.get(key)?.invalid);
      if (otherControlsInvalid) return 'general';
    }

    if (form.get('generalInfo.attributes')?.invalid) return 'attributes';

    const tabMapping: Record<string, string> = {
      pricing: 'pricing',
      inventory: 'inventory',
      media: 'media',
      variations: 'variations',
      seo: 'seo',
      carousel: 'carousel',
    };

    for (const [groupPath, tabKey] of Object.entries(tabMapping)) {
      if (form.get(groupPath)?.invalid) return tabKey;
    }

    return null;
  }
}
