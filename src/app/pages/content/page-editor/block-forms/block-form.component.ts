import { Component, inject, input, output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BlockDto, BlockType, BlockData, HeroBlockData, BannerBlockData, TextBlockData, ImageGalleryBlockData, ProductGridBlockData, CtaBlockData, VideoBlockData, CustomHtmlBlockData } from '../../../../models/block.model';

@Component({
  selector: 'app-block-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './block-form.component.html',
  styleUrl: './block-form.component.css',
})
export class BlockFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  block = input<BlockDto | null>(null);
  blockType = input<BlockType | null>(null);

  formSubmitted = output<BlockData>();
  cancelled = output<void>();

  form: FormGroup<any> = this.fb.group({});

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blockType'] || changes['block']) {
      this.buildForm();
    }
  }

  buildForm(): void {
    const type = this.blockType();
    const block = this.block();

    if (!type) {
      this.form = this.fb.group({});
      return;
    }

    const defaultData = this.getDefaultData(type);
    const existingData = (block?.data ?? {}) as unknown as Record<string, unknown>;

    switch (type) {
      case 'Hero': {
        const defaults = defaultData as HeroBlockData;
        this.form = this.fb.group({
          heading: [existingData['heading'] || defaults.heading || '', Validators.required],
          subheading: [existingData['subheading'] || defaults.subheading || ''],
          backgroundImage: [existingData['backgroundImage'] || defaults.backgroundImage || ''],
          ctaText: [existingData['ctaText'] || defaults.ctaText || ''],
          ctaLink: [existingData['ctaLink'] || defaults.ctaLink || ''],
        });
        break;
      }
      case 'Banner': {
        const defaults = defaultData as BannerBlockData;
        this.form = this.fb.group({
          image: [existingData['image'] || defaults.image || '', Validators.required],
          altText: [existingData['altText'] || defaults.altText || ''],
          link: [existingData['link'] || defaults.link || ''],
          width: [existingData['width'] || defaults.width || ''],
          height: [existingData['height'] || defaults.height || ''],
        });
        break;
      }
      case 'Text': {
        const defaults = defaultData as TextBlockData;
        this.form = this.fb.group({
          htmlContent: [existingData['htmlContent'] || defaults.htmlContent || '', Validators.required],
          alignment: [existingData['alignment'] || defaults.alignment || 'left', Validators.required],
        });
        break;
      }
      case 'ImageGallery': {
        const defaults = defaultData as ImageGalleryBlockData;
        this.form = this.fb.group({
          images: [JSON.stringify(existingData['images'] || defaults.images || []), Validators.required],
        });
        break;
      }
      case 'ProductGrid': {
        const defaults = defaultData as ProductGridBlockData;
        this.form = this.fb.group({
          productIds: [JSON.stringify(existingData['productIds'] || defaults.productIds || []), Validators.required],
          columns: [existingData['columns'] || defaults.columns || 4, [Validators.required, Validators.min(1), Validators.max(6)]],
          showPrices: [existingData['showPrices'] ?? defaults.showPrices ?? true],
        });
        break;
      }
      case 'Cta': {
        const defaults = defaultData as CtaBlockData;
        this.form = this.fb.group({
          heading: [existingData['heading'] || defaults.heading || '', Validators.required],
          subheading: [existingData['subheading'] || defaults.subheading || ''],
          buttonText: [existingData['buttonText'] || defaults.buttonText || '', Validators.required],
          buttonLink: [existingData['buttonLink'] || defaults.buttonLink || '', Validators.required],
          style: [existingData['style'] || defaults.style || 'primary', Validators.required],
        });
        break;
      }
      case 'Video': {
        const defaults = defaultData as VideoBlockData;
        this.form = this.fb.group({
          videoUrl: [existingData['videoUrl'] || defaults.videoUrl || '', Validators.required],
          posterImage: [existingData['posterImage'] || defaults.posterImage || ''],
          autoplay: [existingData['autoplay'] ?? defaults.autoplay ?? false],
        });
        break;
      }
      case 'CustomHtml': {
        const defaults = defaultData as CustomHtmlBlockData;
        this.form = this.fb.group({
          htmlContent: [existingData['htmlContent'] || defaults.htmlContent || '', Validators.required],
        });
        break;
      }
      default:
        this.form = this.fb.group({});
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      this.formSubmitted.emit(formValue as BlockData);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private getDefaultData(type: BlockType): BlockData {
    switch (type) {
      case 'Hero':
        return { heading: '', subheading: '', backgroundImage: '', ctaText: '', ctaLink: '' };
      case 'Banner':
        return { image: '', altText: '', link: '', width: undefined, height: undefined };
      case 'Text':
        return { htmlContent: '', alignment: 'left' };
      case 'ImageGallery':
        return { images: [] };
      case 'ProductGrid':
        return { productIds: [], columns: 4, showPrices: true };
      case 'Cta':
        return { heading: '', subheading: '', buttonText: '', buttonLink: '', style: 'primary' };
      case 'Video':
        return { videoUrl: '', posterImage: '', autoplay: false };
      case 'CustomHtml':
        return { htmlContent: '' };
      default:
        throw new Error(`Unsupported block type: ${type}`);
    }
  }
}