export interface SearchResultDto {
  id: string;
  name: string;
  slug: string;
  pageType: string;
  isPublished: boolean;
  publishedOn: string | null;
  featuredImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
  score: number;
}

export interface SearchPagesResponse {
  items: SearchResultDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface SearchPagesParams {
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
  pageType?: string;
  sortBy?: 'relevance' | 'name' | 'date';
}

export const SEARCH_SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' },
];