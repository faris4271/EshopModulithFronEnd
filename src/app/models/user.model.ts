export interface UserGridItem {
  id: string;
  email: string;
  fullName: string;
  createdOn: string;
  roles: string[];
  groups: string[];
}

export interface UserListResponse {
  items: UserGridItem[];
  totalRecord: number;
}
