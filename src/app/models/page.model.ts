export interface PageDto {
  id: string;
  name: string;
  slug: string;
  pageType: 'LandingPage' | 'ProductPage' | 'CategoryPage' | 'Custom';
  layoutId: string | null;
  content: string | null;
  featuredImage: string | null;
  isHome: boolean;
  sortOrder: number;
  isPublished: boolean;
  publishedOn: string | null;
  metaTitle: string | null;
  metaKeywords: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageDto {
  name: string;
  slug?: string;
  pageType: string;
  layoutId?: string;
  content?: string;
  featuredImage?: string;
  isHome?: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface UpdatePageDto extends CreatePageDto {}

export interface PageListItem {
  id: string;
  name: string;
  slug: string;
  pageType: string;
  layoutId: string | null;
  isHome: boolean;
  isPublished: boolean;
  publishedOn: string | null;
  updatedAt: string;
}

export const PAGE_TYPE_OPTIONS = [
  { value: 'LandingPage', label: 'Landing Page' },
  { value: 'ProductPage', label: 'Product Page' },
  { value: 'CategoryPage', label: 'Category Page' },
  { value: 'Custom', label: 'Custom' },
];