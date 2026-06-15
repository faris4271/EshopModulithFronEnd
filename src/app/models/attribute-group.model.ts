export interface AttributeGroup {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  status: AttributeGroupStatus;
  total_attributes: number;
  created_at: string;
}

export enum AttributeGroupStatus {
  Active = 1,
  Inactive = 0,
}
