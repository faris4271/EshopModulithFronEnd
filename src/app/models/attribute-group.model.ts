export interface AttributeGroup {
  id: string | number;
  name: string;
}

export interface AttributeGroupCreatePayload {
  name: string;
}

export interface AttributeGroupUpdatePayload {
  id: string | number;
  name: string;
}
