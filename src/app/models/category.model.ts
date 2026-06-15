export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  total_products: number;
  status: number;
  description: string;
   metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  displayOrder: number;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  displayOrder: number;
  parentId: string | null;
  includeInMenu: boolean;
  isPublished: boolean;
  thumbnailImageUrl: string;
}

export interface UpdateCategoryDto {
  id:string
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  displayOrder: number;
  parentId: string;
  includeInMenu: boolean;
  isPublished: boolean;
  thumbnailImageUrl: string;
}
