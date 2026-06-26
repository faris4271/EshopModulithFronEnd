export interface ProductOption {
  id: string;
  name: string;
}

export type CreateProductOptionDto = Omit<ProductOption, 'id'>;
export type UpdateProductOptionDto = Partial<CreateProductOptionDto> & { id: string };

