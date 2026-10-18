export interface BlockDto {
  blockId: string;
  blockType: BlockType;
  title: string | null;
  data: BlockData;
  sortOrder: number;
  isVisible: boolean;
}

export type BlockType =
  | 'Hero'
  | 'Banner'
  | 'Text'
  | 'ImageGallery'
  | 'ProductGrid'
  | 'Cta'
  | 'Video'
  | 'CustomHtml';

export interface BlockTypeInfo {
  type: BlockType;
  label: string;
  icon: string;
  description: string;
}

export const BLOCK_TYPES: BlockTypeInfo[] = [
  { type: 'Hero', label: 'Hero', icon: 'stars', description: 'Large hero section with heading, subheading, and CTA' },
  { type: 'Banner', label: 'Banner', icon: 'image', description: 'Image banner with link' },
  { type: 'Text', label: 'Text', icon: 'text_fields', description: 'Rich text content block' },
  { type: 'ImageGallery', label: 'Image Gallery', icon: 'photo_library', description: 'Grid of images with captions' },
  { type: 'ProductGrid', label: 'Product Grid', icon: 'grid_view', description: 'Display products in a grid' },
  { type: 'Cta', label: 'Call to Action', icon: 'call_to_action', description: 'Call to action section' },
  { type: 'Video', label: 'Video', icon: 'video_library', description: 'Video embed block' },
  { type: 'CustomHtml', label: 'Custom HTML', icon: 'code', description: 'Raw HTML content' },
];

export interface HeroBlockData {
  heading: string;
  subheading: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface BannerBlockData {
  image: string;
  altText: string;
  link: string;
  width?: number;
  height?: number;
}

export interface TextBlockData {
  htmlContent: string;
  alignment: 'left' | 'center' | 'right';
}

export interface ImageGalleryBlockData {
  images: Array<{ url: string; alt: string; caption?: string }>;
}

export interface ProductGridBlockData {
  productIds: string[];
  columns: number;
  showPrices: boolean;
}

export interface CtaBlockData {
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  style: 'primary' | 'secondary' | 'outline';
}

export interface VideoBlockData {
  videoUrl: string;
  posterImage: string;
  autoplay: boolean;
}

export interface CustomHtmlBlockData {
  htmlContent: string;
}

export type BlockData =
  | HeroBlockData
  | BannerBlockData
  | TextBlockData
  | ImageGalleryBlockData
  | ProductGridBlockData
  | CtaBlockData
  | VideoBlockData
  | CustomHtmlBlockData;