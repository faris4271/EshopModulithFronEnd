export interface ProductOptionCombinationDto {
  optionId: string;
  optionName: string;
  value: string;
  sortIndex: number;
}

export interface ProductVariationDto {
  thumbnailImageUrl: string;
  normalizedName: string;
  oldPrice: number;
  price: number;
  name: string;
  thumbnailImage: File | null | undefined;
  gtin: string;
  newImages?: File[];
  optionCombinations: ProductOptionCombinationDto[];
  id: number;
  sku: string;
  imageUrls: string[];
}

export interface ProductMediaDto {
  id: number;
  caption: string;
  mediaUrl: string;
}

export interface ProductRelatedDto {
  id: string;
  name: string;
  isPublished: boolean;
}

export interface ProductAttributeDto {
  id: string;
  attributeValueId: number;
  name: string;
  value: string;
  groupId: string;
  groupName: string;
}

export interface ProductOptionValueDto {
  [key: string]: any;
}

export interface ProductOptionDto {
  id: string;
  name: string;
  displayType: string;
  values: ProductOptionValueDto[];
}

export interface CreateProductDto {
  variations: ProductVariationDto[];
  shortDescription: string;
  thumbnailImageUrl: string;
  thumbnailImage?: File;
  brandId: string;
  oldPrice: number;
  specification: string;
  isPublished: boolean;
  isCallForPricing: boolean;
  productImages?: ProductMediaDto[] | File[];
  taxClassId: string;
  price: number;
  productDocuments?: ProductMediaDto[] | File[];
  stockTrackingIsEnabled: boolean;
  name: string;
  specialPriceEnd: string;
  slug: string;
  deletedMediaIds: string[];
  metaKeywords: string;
  relatedProducts: ProductRelatedDto[];
  specialPrice: number;
  specialPriceStart: string;
  gtin: string;
  metaTitle: string;
  isAllowToOrder: boolean;
  crossSellProducts: ProductRelatedDto[];
  metaDescription: string;
  attributes: ProductAttributeDto[];
  isFeatured: boolean;
  categoryIds: string[];
  description: string;
  sku: string;
  options: ProductOptionDto[];
}

export interface Product {
  id: number;
  product_name: string;
  product_brand: string;
  category: number;
  stock: number;
  sku: string;
  price: number;
  qty: number;
  status: number;
  image: string;
  description?: string;
  rating?: number;
}

export enum ProductStatus {
  Scheduled = 1,
  Publish = 2,
  Inactive = 3,
}

export enum ProductStock {
  Out_Of_Stock = 0,
  In_Stock = 1,
}

export enum ProductCategory {
  Household = 0,
  Office = 1,
  Electronics = 2,
  Shoes = 3,
  Accessories = 4,
  Game = 5,
}

export interface ProductItem {
  id: string;
  name: string;
  hasOptions: boolean;
  isVisibleIndividually: boolean;
  createdOn: string;
  isPublished: boolean;
  isFeatured: boolean;
  isCallForPricing: boolean;
  isAllowToOrder: boolean;
  stockQuantity: number;
}

export interface ProductListResponse {
  items: ProductItem[];
  totalRecord: number;
  numberOfPages: number;
}
