export interface LayoutDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  blocks: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLayoutDto {
  name: string;
  slug: string;
  description?: string;
  blocks?: string;
  isDefault?: boolean;
}

export interface UpdateLayoutDto extends CreateLayoutDto {}

export interface LayoutListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}