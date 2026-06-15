import { Injectable, signal, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AddProductService } from '../../../../services/add-product.service';
import { CreateProductDto, Product, ProductItem } from '../../../../models/product.model';
import { ToastService } from '../../../../services/toast.service';
import { Router } from '@angular/router';
import { ProductAttributeService } from '../../../../services/product-attribute.service';
import { ProductOptionService } from '../../../../services/product-option.service';

@Injectable({
  providedIn: 'root',
})
export class ProductFormService {
  private fb = inject(FormBuilder);
  private addProductService = inject(AddProductService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private productAttributeService = inject(ProductAttributeService);
  private productOptionService = inject(ProductOptionService);

  // File State


  thumbnailFile: File | null = null;
  thumbnailPreview = signal<string | null>(null);
  productImageFiles: File[] = [];
  productImagePreviews = signal<string[]>([]);
  productDocumentFiles: File[] = [];
  variationThumbnailFiles: Map<number, File> = new Map();
  variationThumbnailPreviews = signal<Map<number, string>>(new Map());
  variationImageFiles: Map<number, File[]> = new Map();
  variationImagePreviews = signal<Map<number, string[]>>(new Map());

  masterForm: FormGroup = this.fb.group({
    generalInfo: this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required]],
      shortDescription: [''],
      description: [''],
      specification: [''],
      brandId: [''],
      taxClassId: [''],
      categoryIds: this.fb.array<string[]>([]),
      attributes: this.fb.array([]),
      isPublished: [false],
      isFeatured: [false],
    }),
    pricing: this.fb.group({
      price: [0, [Validators.required, Validators.min(0)]],
      oldPrice: [0],
      specialPrice: [0],
      specialPriceStart: [''],
      specialPriceEnd: [''],
      isCallForPricing: [false],
      isAllowToOrder: [true],
    }),
    inventory: this.fb.group({
      sku: [''],
      gtin: [''],
      stockTrackingIsEnabled: [false],
    }),
    media: this.fb.group({
      thumbnailImageUrl: [''],
      productImages: this.fb.array([]),
      productDocuments: this.fb.array([]),
      deletedMediaIds: this.fb.array([]),
    }),
    variations: this.fb.group({
      options: this.fb.array([]),
      variations: this.fb.array([]),
    }),
    seo: this.fb.group({
      metaTitle: [''],
      metaKeywords: [''],
      metaDescription: [''],
    }),
    carousel: this.fb.group({
      relatedProducts: this.fb.array([]),
      crossSellProducts: this.fb.array([]),
    }),
  });

  // Getters for FormArrays
  get categoryIds(): FormArray {
    return this.masterForm.get('generalInfo.categoryIds') as FormArray;
  }

  isCategorySelected(id: number): boolean {
    const selected = this.categoryIds.value as string[];
    return selected.includes(String(id));
  }

  get attributes(): FormArray {
    return this.masterForm.get('generalInfo.attributes') as FormArray;
  }

  get options(): FormArray {
    return this.masterForm.get('variations.options') as FormArray;
  }

  get variations(): FormArray {
    return this.masterForm.get('variations.variations') as FormArray;
  }

  get relatedProducts(): FormArray {
    return this.masterForm.get('carousel.relatedProducts') as FormArray;
  }

  get crossSellProducts(): FormArray {
    return this.masterForm.get('carousel.crossSellProducts') as FormArray;
  }

  getSubGroup(name: string): FormGroup {
    return this.masterForm.get(name) as FormGroup;
  }

  // Logic: General Info
  generateSlug(): void {
    const name = this.masterForm.get('generalInfo.name')?.value;
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      this.masterForm.get('generalInfo.slug')?.setValue(slug);
    }
  }

  toggleCategory(id: number): void {
    const selected = this.categoryIds.value as string[];
    const idStr = String(id);
    const index = selected.indexOf(idStr);
    if (index === -1) {
      this.categoryIds.push(this.fb.control(idStr));
    } else {
      this.categoryIds.removeAt(index);
    }
  }

  addAttribute(attrData?: { name: string; groupId: string; groupName: string }): void {
    this.attributes.push(
      this.fb.group({
        id: [crypto.randomUUID()],
        attributeValueId: [0],
        name: [attrData?.name || '', Validators.required],
        value: ['', Validators.required],
        groupId: [attrData?.groupId || ''],
        groupName: [attrData?.groupName || ''],
      }),
    );
  }

  removeAttribute(index: number): void {
    this.attributes.removeAt(index);
  }

  onAttributeSelect(id: string): void {
    if (!id) return;

    const attr = this.productAttributeService.getAttributeById(id);
    if (!attr) return;

    const existingNames = this.attributes.controls.map((c) => c.get('name')?.value);
    if (existingNames.includes(attr.name)) {
      return;
    }

    this.addAttribute({
      name: attr.name,
      groupId: attr.groupId,
      groupName: attr.groupName,
    });
  }

  // Logic: Variations
  addOption(): void {
    this.options.push(
      this.fb.group({
        id: [crypto.randomUUID()],
        name: ['', Validators.required],
        values: this.fb.array([]),
      }),
    );
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  onOptionSelect(id: string, availableOptions: any[]): void {
    if (!id) return;

    const opt = availableOptions.find((o) => o.id === id);
    if (!opt) return;

    const existingNames = this.options.controls.map((c) => c.get('name')?.value);
    if (existingNames.includes(opt.name)) {
      return;
    }

    this.options.push(
      this.fb.group({
        id: [crypto.randomUUID()],
        name: [opt.name, Validators.required],
        values: this.fb.array([]),
      }),
    );
  }

  getOptionValuesForm(optionIndex: number): FormArray {
    return this.options.at(optionIndex).get('values') as FormArray;
  }

  addOptionValue(optionIndex: number, value?: string): void {
    const val = value || '';
    this.getOptionValuesForm(optionIndex).push(
      this.fb.group({
        id: [crypto.randomUUID()],
        name: [val, Validators.required],
      }),
    );
  }

  removeOptionValue(optionIndex: number, valueIndex: number): void {
    this.getOptionValuesForm(optionIndex).removeAt(valueIndex);
  }

  addVariation(): void {
    this.variations.push(
      this.fb.group({
        id: [0],
        name: ['', Validators.required],
        normalizedName: [''],
        sku: [''],
        gtin: [''],
        price: [0, [Validators.required, Validators.min(0)]],
        oldPrice: [0],
        thumbnailImageUrl: [''],
        thumbnailImage: [''],
        imageUrls: this.fb.array([]),
        newImages: this.fb.array([]),
        optionCombinations: this.fb.array([]),
      }),
    );
  }

  removeVariation(index: number): void {
    this.variations.removeAt(index);
  }

  getVariationOptionCombinations(variationIndex: number): FormArray {
    return this.variations.at(variationIndex).get('optionCombinations') as FormArray;
  }

  addVariationOptionCombination(variationIndex: number): void {
    this.getVariationOptionCombinations(variationIndex).push(
      this.fb.group({
        optionId: [crypto.randomUUID()],
        optionName: ['', Validators.required],
        value: ['', Validators.required],
        sortIndex: [0],
      }),
    );
  }

  removeVariationOptionCombination(variationIndex: number, combIndex: number): void {
    this.getVariationOptionCombinations(variationIndex).removeAt(combIndex);
  }

  generateVariations(): void {
    if (this.options.length === 0) return;

    const optionsData: { name: string; values: string[] }[] = [];
    for (let i = 0; i < this.options.length; i++) {
      const optGroup = this.options.at(i);
      const name = optGroup.get('name')?.value;
      const valuesArray = this.getOptionValuesForm(i);
      const values = valuesArray.controls.map((c) => c.get('name')?.value).filter((v) => v);
      if (name && values.length > 0) {
        optionsData.push({ name, values });
      }
    }

    if (optionsData.length === 0) {
      this.toastService.info('No options with values found. Only Option Headers are assigned, so no variations can be generated.');
      return;
    }

    const combinations = this.cartesianProduct(optionsData);
    this.variations.clear();

    combinations.forEach((combo) => {
      const name = combo.map((c) => c.value).join('-');
      const normalizedName = name.toLowerCase().replace(/\s+/g, '-');
      const combinationsArray = combo.map((c, idx) => ({
        optionId: crypto.randomUUID(),
        optionName: c.option,
        value: c.value,
        sortIndex: idx,
      }));

      const variationGroup = this.fb.group({
        id: [0],
        name: [name, Validators.required],
        normalizedName: [normalizedName],
        sku: [''],
        gtin: [''],
        price: [0, [Validators.required, Validators.min(0)]],
        oldPrice: [0],
        thumbnailImageUrl: [''],
        thumbnailImage: [''],
        imageUrls: this.fb.array([]),
        newImages: this.fb.array([]),
        optionCombinations: this.fb.array(
          combinationsArray.map((c) =>
            this.fb.group({
              optionId: [c.optionId],
              optionName: [c.optionName, Validators.required],
              value: [c.value, Validators.required],
              sortIndex: [c.sortIndex],
            }),
          ),
        ),
      });

      this.variations.push(variationGroup);
    });
  }

  private cartesianProduct(
    options: { name: string; values: string[] }[],
  ): { option: string; value: string }[][] {
    if (options.length === 0) return [[]];
    const [first, ...rest] = options;
    const restProduct = this.cartesianProduct(rest);
    const result: { option: string; value: string }[][] = [];
    for (const value of first.values) {
      for (const combo of restProduct) {
        result.push([{ option: first.name, value }, ...combo]);
      }
    }
    return result;
  }

  // Logic: Carousel
  addRelatedProduct(): void {
    this.relatedProducts.push(
      this.fb.group({
        id: [crypto.randomUUID()],
        name: [''],
        isPublished: [true],
      }),
    );
  }

  removeRelatedProduct(index: number): void {
    this.relatedProducts.removeAt(index);
  }

  removeRelatedProductById(productId: string): void {
    const index = this.relatedProducts.controls.findIndex(
      (control) => control.get('id')?.value === productId
    );
    if (index !== -1) {
      this.relatedProducts.removeAt(index);
    }
  }

  addCrossSellProduct(): void {
    this.crossSellProducts.push(
      this.fb.group({
        id: [crypto.randomUUID()],
        name: [''],
        isPublished: [true],
      }),
    );
  }

  removeCrossSellProduct(index: number): void {
    this.crossSellProducts.removeAt(index);
  }

  addProductToRelated(product: ProductItem): void {
    this.relatedProducts.push(
      this.fb.group({
        id: [product.id],
        name: [product.name],
        isPublished: [true],
      }),
    );
  }

  addProductToCrossSell(product: ProductItem): void {
    this.crossSellProducts.push(
      this.fb.group({
        id: [product.id],
        name: [product.name, Validators.required],
        isPublished: [true],
      }),
    );
  }

  // Logic: Media
  onThumbnailImageChange(file: File): void {
    this.thumbnailFile = file;
    const reader = new FileReader();
    reader.onload = (e) => this.thumbnailPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onProductImagesChange(files: File[]): void {
    this.productImageFiles = [...this.productImageFiles, ...files];
    const previews = [...this.productImagePreviews()];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        this.productImagePreviews.set([...previews]);
      };
      reader.readAsDataURL(file);
    });
  }

  removeProductImage(index: number): void {
    this.productImageFiles = this.productImageFiles.filter((_, i) => i !== index);
    this.productImagePreviews.set(this.productImagePreviews().filter((_, i) => i !== index));
  }

  onProductDocumentsChange(files: File[]): void {
    this.productDocumentFiles = [...this.productDocumentFiles, ...files];
  }

  removeProductDocument(index: number): void {
    this.productDocumentFiles = this.productDocumentFiles.filter((_, i) => i !== index);
  }

  onVariationThumbnailChange(variationIndex: number, file: File): void {
    this.variationThumbnailFiles.set(variationIndex, file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const previews = new Map(this.variationThumbnailPreviews());
      previews.set(variationIndex, e.target?.result as string);
      this.variationThumbnailPreviews.set(previews);
    };
    reader.readAsDataURL(file);
  }

  removeVariationThumbnail(variationIndex: number): void {
    this.variationThumbnailFiles.delete(variationIndex);
    const previews = new Map(this.variationThumbnailPreviews());
    previews.delete(variationIndex);
    this.variationThumbnailPreviews.set(previews);
  }

  onVariationImagesChange(variationIndex: number, files: File[]): void {
    const existingFiles = this.variationImageFiles.get(variationIndex) || [];
    this.variationImageFiles.set(variationIndex, [...existingFiles, ...files]);

    const existingPreviews = this.variationImagePreviews().get(variationIndex) || [];
    const allPreviews = [...existingPreviews];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        allPreviews.push(e.target?.result as string);
        const previewsMap = new Map(this.variationImagePreviews());
        previewsMap.set(variationIndex, [...allPreviews]);
        this.variationImagePreviews.set(previewsMap);
      };
      reader.readAsDataURL(file);
    });
  }

  removeVariationImage(variationIndex: number, imageIndex: number): void {
    const files = this.variationImageFiles.get(variationIndex) || [];
    this.variationImageFiles.set(
      variationIndex,
      files.filter((_, i) => i !== imageIndex),
    );

    const previewsMap = new Map(this.variationImagePreviews());
    const previews = previewsMap.get(variationIndex) || [];
    previewsMap.set(
      variationIndex,
      previews.filter((_, i) => i !== imageIndex),
    );
    this.variationImagePreviews.set(previewsMap);
  }

  // Validation Helpers
  isFieldInvalid(subGroup: string, controlName: string): boolean {
    const control = this.masterForm.get(`${subGroup}.${controlName}`);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(subGroup: string, controlName: string): string {
    const control = this.masterForm.get(`${subGroup}.${controlName}`);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return `${controlName} is required`;
    if (control.errors['minlength']) return `${controlName} is too short`;
    if (control.errors['min']) return `${controlName} must be >= 0`;
    return 'Invalid value';
  }

  // Submission
  submitFullProduct(isSubmittingSignal: any): void {
    if (this.masterForm.invalid) {
      this.masterForm.markAllAsTouched();
      return;
    }

    isSubmittingSignal.set(true);
    const formValue = this.masterForm.value;
    
    const dto: CreateProductDto = {
      ...formValue.generalInfo,
      ...formValue.pricing,
      ...formValue.inventory,
      ...formValue.seo,
      thumbnailImageUrl: formValue.media.thumbnailImageUrl,
      categoryIds: formValue.generalInfo.categoryIds,
      attributes: formValue.generalInfo.attributes,
      options: formValue.variations.options,
      variations: (formValue.variations.variations || []).map((v: any, index: number) => ({
        ...v,
        thumbnailImage: this.variationThumbnailFiles.get(index) || null,
        newImages: this.variationImageFiles.get(index) || [],
      })),
      relatedProducts: formValue.carousel.relatedProducts,
      crossSellProducts: formValue.carousel.crossSellProducts,
      thumbnailImage: this.thumbnailFile ?? undefined,
      productImages: this.productImageFiles.length > 0 ? this.productImageFiles : [],
      productDocuments: this.productDocumentFiles.length > 0 ? this.productDocumentFiles : [],
    };

    this.addProductService
      .createProduct(
        dto,
        this.thumbnailFile ?? undefined,
        this.productImageFiles.length > 0 ? this.productImageFiles : undefined,
        this.productDocumentFiles.length > 0 ? this.productDocumentFiles : undefined
      )
      .subscribe({
        next: () => {
          isSubmittingSignal.set(false);
          this.toastService.success('Product created successfully!');
          this.router.navigate(['/products']);
        },
        error: (err: any) => {
          console.error('Failed to create product:', err);
          isSubmittingSignal.set(false);
        },
      });
  }
}
