import { Component, inject, signal, computed, OnInit, OnDestroy, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { BlockDto, BlockType, BLOCK_TYPES, BlockData, HeroBlockData, BannerBlockData, TextBlockData, ImageGalleryBlockData, ProductGridBlockData, CtaBlockData, VideoBlockData, CustomHtmlBlockData } from '../../../../models/block.model';
import { BlockFormComponent } from '../block-forms/block-form.component';
import { BlockRendererComponent } from './block-renderer.component';

@Component({
  selector: 'app-block-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, BlockFormComponent, BlockRendererComponent],
  templateUrl: './block-editor.component.html',
  styleUrl: './block-editor.component.css',
})
export class BlockEditorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);

  initialBlocks = input<string>('[]');
  blocksChange = output<string>();

  blocks = signal<BlockDto[]>([]);
  showAddDialog = signal(false);
  editingBlockIndex = signal<number | null>(null);
  destroy$ = new Subject<void>();

  blockTypes = BLOCK_TYPES;

  blocksForm = this.fb.array<FormGroup>([]);

  ngOnInit(): void {
    this.loadBlocksFromJson(this.initialBlocks());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addBlock(type: BlockType): void {
    const newBlock: BlockDto = {
      blockId: crypto.randomUUID(),
      blockType: type,
      title: this.getDefaultTitle(type),
      data: this.getDefaultData(type),
      sortOrder: this.blocks().length,
      isVisible: true,
    };
    this.blocks.update(b => [...b, newBlock]);
    this.emitBlocksChange();
    this.showAddDialog.set(false);
  }

  removeBlock(index: number): void {
    this.blocks.update(blocks => blocks.filter((_, i) => i !== index));
    this.reorderBlocks();
    this.emitBlocksChange();
  }

  duplicateBlock(index: number): void {
    const block = this.blocks()[index];
    if (block) {
      const newBlock: BlockDto = {
        ...block,
        blockId: crypto.randomUUID(),
        sortOrder: block.sortOrder + 1,
      };
      this.blocks.update(blocks => [...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)]);
      this.reorderBlocks();
      this.emitBlocksChange();
    }
  }

  toggleVisibility(index: number): void {
    this.blocks.update(blocks =>
      blocks.map((b, i) => i === index ? { ...b, isVisible: !b.isVisible } : b)
    );
    this.emitBlocksChange();
  }

  editBlock(index: number): void {
    this.editingBlockIndex.set(index);
  }

  closeEditDialog(): void {
    this.editingBlockIndex.set(null);
  }

  onBlockUpdated(index: number, data: BlockData): void {
    this.blocks.update(blocks =>
      blocks.map((b, i) => i === index ? { ...b, data } : b)
    );
    this.emitBlocksChange();
    this.closeEditDialog();
  }

  drop(event: CdkDragDrop<BlockDto[]>): void {
    const blocks = this.blocks();
    moveItemInArray(blocks, event.previousIndex, event.currentIndex);
    this.reorderBlocks();
    this.emitBlocksChange();
  }

  reorderBlocks(): void {
    this.blocks.update(blocks => blocks.map((b, i) => ({ ...b, sortOrder: i })));
  }

  getBlocksJson(): string {
    return JSON.stringify(this.blocks(), null, 2);
  }

  loadBlocksFromJson(json: string): void {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        this.blocks.set(parsed as BlockDto[]);
        this.reorderBlocks();
      }
    } catch (e) {
      console.error('Invalid JSON:', e);
    }
  }

  private emitBlocksChange(): void {
    this.blocksChange.emit(this.getBlocksJson());
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.getBlocksJson());
  }

  private getDefaultTitle(type: BlockType): string {
    const blockType = BLOCK_TYPES.find(b => b.type === type);
    return blockType?.label || type;
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