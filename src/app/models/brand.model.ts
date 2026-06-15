export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  isPublished: boolean;
  isDeleted: boolean;
}

export interface CreateBrandDto {
  name: string;
  slug: string;
  description: string;
  isPublished: boolean;
}

export interface UpdateBrandDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  isPublished: boolean;
}
