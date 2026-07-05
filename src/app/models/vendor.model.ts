export interface VendorItem {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  slug: string;
  createdOn: string;
}

export interface VendorDto {
  id?: string;
  name: string;
  slug: string;
  email: string;
  description: string;
  isActive: boolean;
}

export interface VendorListResponse {
  items: VendorItem[];
  totalRecord: number;
}