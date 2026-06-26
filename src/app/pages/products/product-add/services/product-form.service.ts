import { Injectable, signal, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CreateProductDto, Product, ProductItem, ProductMediaDto } from '../../../../models/product.model';
import { ToastService } from '../../../../services/toast.service';
import { Router } from '@angular/router';
import { ProductAttributeService } from '../../../../services/product-attribute.service';
import { ProductOptionService } from '../../../../services/product-option.service';
import { ProductService } from '../../../../services/product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductFormService {

  /**
   * Reset the entire form and all related state.
   * Used when navigating from edit mode back to add mode because the service
   * is a root‑provided singleton and retains previous values.
   */
  resetForm(): void {
    this.masterForm.reset({
      generalInfo: {
        name: '',
        slug: '',
        shortDescription: '',
        description: '',
        specification: '',
        brandId: '',
        taxClassId: '',
        isPublished: false,
        isFeatured: false,
      },
      pricing: {
        price: 0,
        oldPrice: 0,
        specialPrice: 0,
        specialPriceStart: '',
        specialPriceEnd: '',
        isCallForPricing: false,
        isAllowToOrder: true,
      },
      inventory: {
        sku: '',
        gtin: '',
        stockTrackingIsEnabled: false,
      },
      media: {
        thumbnailImageUrl: '',
      },
      seo: {
        metaTitle: '',
        metaKeywords: '',
        metaDescription: '',
      },
    });
    this.categoryIds.clear();
    this.attributes.clear();
    this.options.clear();
    this.variations.clear();
    this.relatedProducts.clear();
    this.crossSellProducts.clear();
    (this.masterForm.get('media.productImages') as any)?.setValue([]);
    (this.masterForm.get('media.productDocuments') as any)?.setValue([]);
    (this.masterForm.get('media.deletedMediaIds') as any)?.setValue([]);
    this.productId = null;
    this.existingProductImages.set([]);
    this.existingProductDocuments.set([]);
    this.thumbnailFile = null;
    this.thumbnailPreview.set(null);
    this.productImageFiles = [];
    this.productImagePreviews.set([]);
    this.productDocumentFiles = [];
    this.variationThumbnailFiles = new Map();
    this.variationThumbnailPreviews.set(new Map());
    this.variationImageFiles = new Map();
    this.variationImagePreviews.set(new Map());
  }

  
  // Product ID for edit mode
  productId: string | null = null;
  // Existing media URLs (for display in edit mode)
  existingProductImages = signal<ProductMediaDto[]>([]);
  existingProductDocuments = signal<ProductMediaDto[]>([]);

  private fb = inject(FormBuilder);
  private addProductService = inject(ProductService);
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
      price: [0, [Validators.required, Validators.min(0.01)]],
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

  isCategorySelected(id: string): boolean {
    const selected = this.categoryIds.value as string[];
    return selected.includes(id);
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

  toggleCategory(id: string): void {
    const selected = this.categoryIds.value as string[];
    const idStr = String(id);
    const index = selected.indexOf(idStr);
    if (index === -1) {
      this.categoryIds.push(this.fb.control(idStr));
    } else {
      this.categoryIds.removeAt(index);
    }
  }

  addAttribute(attrData?: { id: string; name: string; groupId: string; groupName: string }): void {
    this.attributes.push(
      this.fb.group({
        id: [attrData?.id || ''],
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

    this.productAttributeService.getAttributeById(id).subscribe((attr) => {
      if (!attr) return;

      this.applyAttribute({
        id: attr.id,
        name: attr.name,
        groupId: attr.groupId,
        groupName: attr.groupName,
      });
    });
  }

  applyAttribute(attrData: { id: string; name: string; groupId: string; groupName: string }): void {
    const existingIds = this.attributes.controls.map((c) => c.get('id')?.value);
    if (existingIds.includes(attrData.id)) {
      return;
    }

    this.addAttribute(attrData);
  }

  applyTemplate(templateAttributes: { id: string; name: string; groupName: string }[]): void {
    templateAttributes.forEach((attr => {
      this.productAttributeService.getAttributeById(attr.id).subscribe((fullAttr) => {
        if (fullAttr) {
          this.applyAttribute({
            id: fullAttr.id,
            name: fullAttr.name,
            groupId: fullAttr.groupId,
            groupName: fullAttr.groupName,
          });
        }
      });
    }));
  }

  // Logic: Variations
  addOption(): void {
    this.options.push(
      this.fb.group({
        id: [''],
        name: ['', Validators.required],
        displayType: ['text'],
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
        id: [opt.id],
        name: [opt.name, Validators.required],
        displayType: [opt.displayType || 'text'],
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
        id: [''],
        name: [val, Validators.required],
        displayType: ['text'],
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
        optionId: [''],
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

    const optionsData: { id: string; name: string; values: string[] }[] = [];
    for (let i = 0; i < this.options.length; i++) {
const optGroup = this.options.at(i);
        const id = optGroup.get('id')?.value;
        const name = optGroup.get('name')?.value;
        const valuesArray = this.getOptionValuesForm(i);
        const values = valuesArray.controls.map((c) => c.get('name')?.value).filter((v) => v);
        if (name && values.length > 0) {
          optionsData.push({ id: id || '', name, values });
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
        optionId: c.optionId,
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
    options: { id: string; name: string; values: string[] }[],
  ): { optionId: string; option: string; value: string }[][] {
    if (options.length === 0) return [[]];
    const [first, ...rest] = options;
    const restProduct = this.cartesianProduct(rest);
    const result: { optionId: string; option: string; value: string }[][] = [];
    for (const value of first.values) {
      for (const combo of restProduct) {
        result.push([{ optionId: first.id, option: first.name, value }, ...combo]);
      }
    }
    return result;
  }

  patchFormData(product: any): void {
    this.masterForm.patchValue({
      generalInfo: {
        name: product.name || '',
        slug: product.slug || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        specification: product.specification || '',
        brandId: product.brandId || '',
        taxClassId: product.taxClassId || '',
        isPublished: product.isPublished ?? false,
        isFeatured: product.isFeatured ?? false,
      },
      pricing: {
        price: product.price || 0,
        oldPrice: product.oldPrice || 0,
        specialPrice: product.specialPrice || 0,
        specialPriceStart: product.specialPriceStart || '',
        specialPriceEnd: product.specialPriceEnd || '',
        isCallForPricing: product.isCallForPricing ?? false,
        isAllowToOrder: product.isAllowToOrder ?? true,
      },
      inventory: {
        sku: product.sku || '',
        gtin: product.gtin || '',
        stockTrackingIsEnabled: product.stockTrackingIsEnabled ?? false,
      },
      media: {
        thumbnailImageUrl: product.thumbnailImageUrl || '',
      },
      seo: {
        metaTitle: product.metaTitle || '',
        metaKeywords: product.metaKeywords || '',
        metaDescription: product.metaDescription || '',
      },
    });

    // Category IDs
    this.categoryIds.clear();
    (product.categoryIds || []).forEach((id: string) => {
      this.categoryIds.push(this.fb.control(id));
    });

    // Attributes
    this.attributes.clear();
    (product.attributes || []).forEach((attr: any) => {
      this.attributes.push(
        this.fb.group({
          id: [attr.id],
          name: [attr.name, Validators.required],
          value: [attr.value, Validators.required],
          groupId: [attr.groupId || ''],
          groupName: [attr.groupName || ''],
        }),
      );
    });

    // Options
    this.options.clear();
    (product.options || []).forEach((opt: any) => {
      const optGroup = this.fb.group({
        id: [opt.id],
        name: [opt.name, Validators.required],
        displayType: [opt.displayType || 'text'],
        values: this.fb.array([]),
      });
      this.options.push(optGroup);
      const valuesArr = optGroup.get('values') as FormArray;
      (opt.values || []).forEach((val: any) => {
        valuesArr.push(this.fb.group({
          id: [val.id],
          name: [val.name ,Validators.required],
          displayType: [val.displayType || 'text'],
        }));
      });
    });

    // Variations
    this.variations.clear();
    const thumbPreviews = new Map<number, string>();
    const imgPreviews = new Map<number, string[]>();

    (product.variations || []).forEach((v: any, index: number) => {
      const variationGroup = this.fb.group({
        id: [v.id],
        name: [v.name, Validators.required],
        normalizedName: [v.normalizedName],
        sku: [v.sku],
        gtin: [v.gtin],
        price: [v.price, [Validators.required, Validators.min(0)]],
        oldPrice: [v.oldPrice],
        thumbnailImageUrl: [v.thumbnailImageUrl],
        thumbnailImage: [''],
        imageUrls: this.fb.array([]),
        newImages: this.fb.array([]),
        optionCombinations: this.fb.array([]),
      });
      this.variations.push(variationGroup);

      // Existing image URLs
      const imageUrls = v.imageUrls || [];
      imageUrls.forEach((url: string) => {
        (variationGroup.get('imageUrls') as FormArray).push(this.fb.control(url));
      });

      // Populate previews maps
      if (v.thumbnailImageUrl) {
        thumbPreviews.set(index, v.thumbnailImageUrl);
      }
      if (imageUrls.length > 0) {
        imgPreviews.set(index, [...imageUrls]);
      }

      // Option combinations
      const combosArr = variationGroup.get('optionCombinations') as FormArray;
      (v.optionCombinations || []).forEach((c: any) => {
        combosArr.push(
          this.fb.group({
            optionId: [c.optionId],
            optionName: [c.optionName, Validators.required],
            value: [c.value, Validators.required],
            sortIndex: [c.sortIndex],
          })
        );
      });
    });
    this.variationThumbnailPreviews.set(thumbPreviews);
    this.variationImagePreviews.set(imgPreviews);

    // Media existing arrays for display
    this.existingProductImages.set(product.productImages || []);
    this.existingProductDocuments.set(product.productDocuments || []);

    // Set thumbnail preview if URL exists
    if (product.thumbnailImageUrl) {
      this.thumbnailPreview.set(product.thumbnailImageUrl);
    }
  }

  loadProduct(id: string): void {
    this.productId = id;
    this.addProductService.getProductById(id).subscribe({
      next: (product: any) => {
        this.patchFormData(product);
      },
      error: (err: any) => {
        console.error('Failed to load product:', err);
      },
    });
  }

  // Logic: Carousel
  addRelatedProduct(): void {
    this.relatedProducts.push(
      this.fb.group({
        id: [''],
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
        id: [''],
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
  removeExistingProductImage(index: number): void {
    const images = [...this.existingProductImages()];
    const removed = images.splice(index, 1)[0];
    this.existingProductImages.set(images);
    if (removed?.id) {
      (this.masterForm.get('media.deletedMediaIds') as FormArray).push(this.fb.control(removed.id));
    }
  }

  removeExistingProductDocument(index: number): void {
    const docs = [...this.existingProductDocuments()];
    const removed = docs.splice(index, 1)[0];
    this.existingProductDocuments.set(docs);
    if (removed?.id) {
      (this.masterForm.get('media.deletedMediaIds') as FormArray).push(this.fb.control(removed.id));
    }
  }

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
    const variation = this.variations.at(variationIndex);
    if (variation) {
      variation.get('thumbnailImageUrl')?.setValue('');
    }
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
    const variation = this.variations.at(variationIndex);
    if (!variation) return;

    const imageUrlsFormArray = variation.get('imageUrls') as FormArray;
    const existingCount = imageUrlsFormArray.length;

    if (imageIndex < existingCount) {
      // Existing image: remove from FormArray
      imageUrlsFormArray.removeAt(imageIndex);
    } else {
      // New image: remove from files map
      const files = this.variationImageFiles.get(variationIndex) || [];
      const newFileIndex = imageIndex - existingCount;
      this.variationImageFiles.set(
        variationIndex,
        files.filter((_, i) => i !== newFileIndex),
      );
    }

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
    
    const generalInfo = formValue.generalInfo;
    const pricing = formValue.pricing;
    const inventory = formValue.inventory;
    const seo = formValue.seo;

    // Filter out attributes with invalid or missing UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const originalAttributes = generalInfo.attributes || [];
    const validAttributes = originalAttributes.filter((attr: any) => uuidRegex.test(attr.id));
    if (validAttributes.length < originalAttributes.length) {
      this.toastService.info('Some attributes have invalid IDs and will be omitted from the save. Please review them.');
    }
    const dto: CreateProductDto = {
      ...generalInfo,
      isPublished: generalInfo.isPublished ?? false,
      isFeatured: generalInfo.isFeatured ?? false,
      ...pricing,
      isCallForPricing: pricing.isCallForPricing ?? false,
      isAllowToOrder: pricing.isAllowToOrder ?? true,
      ...inventory,
      stockTrackingIsEnabled: inventory.stockTrackingIsEnabled ?? false,
      ...seo,
      thumbnailImageUrl: formValue.media.thumbnailImageUrl,
      categoryIds: generalInfo.categoryIds,
      attributes: validAttributes,
      options: formValue.variations.options,
      variations: (formValue.variations.variations || []).map((v: any, index: number) => ({
        ...v,
        thumbnailImage: this.variationThumbnailFiles.get(index) || null,
        newImages: this.variationImageFiles.get(index) || [],
      })),
      relatedProducts: (formValue.carousel.relatedProducts || []).map((p: any) => ({
        ...p,
        isPublished: p.isPublished ?? false,
      })),
      crossSellProducts: (formValue.carousel.crossSellProducts || []).map((p: any) => ({
        ...p,
        isPublished: p.isPublished ?? false,
      })),
      thumbnailImage: this.thumbnailFile ?? undefined,
      productImages: this.productImageFiles.length > 0 ? this.productImageFiles : [],
      productDocuments: this.productDocumentFiles.length > 0 ? this.productDocumentFiles : [],
      deletedMediaIds: formValue.media.deletedMediaIds || [],
    };

    const serviceCall = this.productId
      ? this.addProductService.updateProduct(
          this.productId,
          dto,
          this.thumbnailFile ?? undefined,
          this.productImageFiles.length > 0 ? this.productImageFiles : undefined,
          this.productDocumentFiles.length > 0 ? this.productDocumentFiles : undefined
        )
      : this.addProductService.createProduct(
          dto,
          this.thumbnailFile ?? undefined,
          this.productImageFiles.length > 0 ? this.productImageFiles : undefined,
          this.productDocumentFiles.length > 0 ? this.productDocumentFiles : undefined
        );
    serviceCall
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
