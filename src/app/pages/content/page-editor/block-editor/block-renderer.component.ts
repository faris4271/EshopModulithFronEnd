import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockDto, BlockData, HeroBlockData, BannerBlockData, TextBlockData, ImageGalleryBlockData, ProductGridBlockData, CtaBlockData, VideoBlockData, CustomHtmlBlockData } from '../../../../models/block.model';

@Component({
  selector: 'app-block-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './block-renderer.component.html',
  styleUrl: './block-renderer.component.css',
})
export class BlockRendererComponent {
  block = input<BlockDto | null>(null);
  editable = input(false);

  getHeroData(): HeroBlockData | null {
    return this.block()?.data as HeroBlockData || null;
  }

  getBannerData(): BannerBlockData | null {
    return this.block()?.data as BannerBlockData || null;
  }

  getTextData(): TextBlockData | null {
    return this.block()?.data as TextBlockData || null;
  }

  getGalleryData(): ImageGalleryBlockData | null {
    return this.block()?.data as ImageGalleryBlockData || null;
  }

  getProductGridData(): ProductGridBlockData | null {
    return this.block()?.data as ProductGridBlockData || null;
  }

  getCtaData(): CtaBlockData | null {
    return this.block()?.data as CtaBlockData || null;
  }

  getVideoData(): VideoBlockData | null {
    return this.block()?.data as VideoBlockData || null;
  }

  getCustomHtmlData(): CustomHtmlBlockData | null {
    return this.block()?.data as CustomHtmlBlockData || null;
  }

  isVisible(): boolean {
    return this.block()?.isVisible ?? true;
  }

  getYoutubeEmbedUrl(url: string): string {
    const videoId = this.extractYoutubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  private extractYoutubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  getCtaButtonClass(style: string): string {
    const base = 'inline-flex items-center px-6 py-3 font-medium rounded-lg transition-colors';
    switch (style) {
      case 'primary':
        return `${base} bg-indigo-600 text-white hover:bg-indigo-700`;
      case 'secondary':
        return `${base} bg-gray-600 text-white hover:bg-gray-700`;
      case 'outline':
        return `${base} border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50`;
      default:
        return `${base} bg-indigo-600 text-white hover:bg-indigo-700`;
    }
  }
}