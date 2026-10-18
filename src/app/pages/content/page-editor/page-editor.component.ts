import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PageService } from '../../../services/page.service';
import { LayoutService } from '../../../services/layout.service';
import { PageDto, CreatePageDto, UpdatePageDto } from '../../../models/page.model';
import { LayoutListItem } from '../../../models/layout.model';
import { ToastService } from '../../../services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { BlockEditorComponent } from './block-editor/block-editor.component';

interface PageEditorTabs {
  content: 'Content';
  seo: 'SEO';
  settings: 'Settings';
  preview: 'Preview';
  blocks: 'Blocks';
}

type TabKey = keyof PageEditorTabs;

@Component({
  selector: 'app-page-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BlockEditorComponent],
  templateUrl: './page-editor.component.html',
  styleUrl: './page-editor.component.css',
})
export class PageEditorComponent implements OnInit, OnDestroy {
  private pageService = inject(PageService);
  private layoutService = inject(LayoutService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isEditing = signal(false);
  pageId = signal<string | null>(null);
  isSubmitting = signal(false);
  activeTab = signal<TabKey>('content');
  layouts = signal<LayoutListItem[]>([]);

  destroy$ = new Subject<void>();

  tabs: { key: TabKey; label: string }[] = [
    { key: 'content', label: 'Content' },
    { key: 'seo', label: 'SEO' },
    { key: 'settings', label: 'Settings' },
    { key: 'preview', label: 'Preview' },
    { key: 'blocks', label: 'Blocks' },
  ];

  masterForm = this.fb.group({
    // Content tab
    content: this.fb.group({
      pageName: ['', [Validators.required, Validators.maxLength(200)]],
      slug: ['', [Validators.required, Validators.maxLength(200), Validators.pattern(/^[a-z0-9-]+$/)]],
      pageType: ['LandingPage', Validators.required],
      layoutId: [''],
      blocks: ['[]'],
      featuredImage: [''],
      isHome: [false],
      sortOrder: [0],
    }),
    // SEO tab
    seo: this.fb.group({
      metaTitle: ['', [Validators.maxLength(70)]],
      metaKeywords: ['', [Validators.maxLength(255)]],
      metaDescription: ['', [Validators.maxLength(160)]],
      canonicalUrl: ['', [Validators.maxLength(255)]],
      ogTitle: ['', [Validators.maxLength(70)]],
      ogDescription: ['', [Validators.maxLength(160)]],
      ogImage: [''],
    }),
    // Settings tab
    settings: this.fb.group({
      // Additional settings can go here
    }),
  });

  get contentForm(): FormGroup {
    return this.masterForm.get('content') as FormGroup;
  }

  get seoForm(): FormGroup {
    return this.masterForm.get('seo') as FormGroup;
  }

  get settingsForm(): FormGroup {
    return this.masterForm.get('settings') as FormGroup;
  }

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.pageId.set(id);
    }
  }

  ngOnInit(): void {
    this.loadLayouts();

    if (!this.isEditing()) {
      this.resetForm();
    } else if (this.pageId()) {
      this.loadPage(this.pageId()!);
    }

    // Auto-generate slug from name
    this.contentForm.get('pageName')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value && !this.contentForm.get('slug')?.dirty) {
        this.contentForm.get('slug')?.setValue(this.generateSlug(value));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLayouts(): void {
    this.layoutService.getAllLayouts().subscribe({
      next: (layouts) => this.layouts.set(layouts),
      error: (err) => console.error('Failed to load layouts:', err),
    });
  }

  loadPage(id: string): void {
    this.pageService.getPageById(id).subscribe({
      next: (page) => this.populateForm(page),
      error: (err) => {
        console.error('Failed to load page:', err);
        this.toastService.error('Failed to load page');
        this.router.navigate(['/content/pages']);
      },
    });
  }

  populateForm(page: PageDto): void {
    this.contentForm.patchValue({
      pageName: page.name,
      slug: page.slug,
      pageType: page.pageType,
      layoutId: page.layoutId || '',
      blocks: page.content || '[]',
      featuredImage: page.featuredImage || '',
      isHome: page.isHome,
      sortOrder: page.sortOrder,
    });

    this.seoForm.patchValue({
      metaTitle: page.metaTitle || '',
      metaKeywords: page.metaKeywords || '',
      metaDescription: page.metaDescription || '',
      canonicalUrl: page.canonicalUrl || '',
      ogTitle: page.ogTitle || '',
      ogDescription: page.ogDescription || '',
      ogImage: page.ogImage || '',
    });
  }

  resetForm(): void {
    this.masterForm.reset({
      content: {
        pageName: '',
        slug: '',
        pageType: 'LandingPage',
        layoutId: '',
        blocks: '[]',
        featuredImage: '',
        isHome: false,
        sortOrder: 0,
      },
      seo: {
        metaTitle: '',
        metaKeywords: '',
        metaDescription: '',
        canonicalUrl: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
      },
      settings: {},
    });
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  onSubmit(): void {
    if (this.masterForm.invalid) {
      this.masterForm.markAllAsTouched();
      const firstInvalidTab = this.findFirstInvalidTab();
      if (firstInvalidTab) {
        this.activeTab.set(firstInvalidTab);
        this.toastService.error(`Please correct the errors in the ${this.getTabLabel(firstInvalidTab)} tab.`);
      }
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.masterForm.getRawValue();
    const dto: CreatePageDto | UpdatePageDto = {
      name: formValue.content.pageName!,
      slug: formValue.content.slug!,
      pageType: formValue.content.pageType!,
      layoutId: formValue.content.layoutId || undefined,
      content: formValue.content.blocks!,
      featuredImage: formValue.content.featuredImage || undefined,
      isHome: formValue.content.isHome ?? false,
      sortOrder: formValue.content.sortOrder ?? 0,
      metaTitle: formValue.seo.metaTitle || undefined,
      metaKeywords: formValue.seo.metaKeywords || undefined,
      metaDescription: formValue.seo.metaDescription || undefined,
      canonicalUrl: formValue.seo.canonicalUrl || undefined,
      ogTitle: formValue.seo.ogTitle || undefined,
      ogDescription: formValue.seo.ogDescription || undefined,
      ogImage: formValue.seo.ogImage || undefined,
    };

    const request = this.isEditing()
      ? this.pageService.updatePage(this.pageId()!, dto as UpdatePageDto)
      : this.pageService.createPage(dto as CreatePageDto);

    request.subscribe({
      next: (id) => {
        this.toastService.success(this.isEditing() ? 'Page updated successfully' : 'Page created successfully');
        this.isSubmitting.set(false);
        this.router.navigate(['/content/pages']);
      },
      error: (err) => {
        console.error('Failed to save page:', err);
        this.toastService.error(this.isEditing() ? 'Failed to update page' : 'Failed to create page');
        this.isSubmitting.set(false);
      },
    });
  }

  private findFirstInvalidTab(): TabKey | null {
    const form = this.masterForm;
    const tabGroups: Record<TabKey, string> = {
      content: 'content',
      seo: 'seo',
      settings: 'settings',
      preview: 'preview', // preview doesn't have a form
      blocks: '', // blocks is a control inside content group, no separate form group
    };

    for (const [tabKey, groupPath] of Object.entries(tabGroups)) {
      if (tabKey === 'preview' || tabKey === 'blocks') continue;
      if (form.get(groupPath)?.invalid) return tabKey as TabKey;
    }
    return null;
  }

  private getTabLabel(key: TabKey): string {
    const tab = this.tabs.find(t => t.key === key);
    return tab?.label || key;
  }

  cancel(): void {
    this.router.navigate(['/content/pages']);
  }
}