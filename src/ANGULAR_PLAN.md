# CMS Dashboard — Angular Admin Panel

> Operator-facing Angular app for managing CMS pages, layouts, blocks, and SEO.
> Port: `http://localhost:4200` (default Angular CLI)

---

## 1. Tech Stack

| Concern | Choice | Why |
|---------|--------|-----|
| Framework | Angular 19+ (standalone components) | Latest Angular with signals, modern patterns |
| Build | Angular CLI / esbuild | Fast builds, HMR |
| Language | TypeScript 5.x (strict) | Type safety with backend DTOs |
| State / Data | Angular Signals + `HttpClient` | Lightweight, no NgRx needed for this scope |
| Forms | Reactive Forms | Complex block-based content editing |
| UI | Angular Material 3 + Tailwind CSS v4 | Material for data tables/forms, Tailwind for layout |
| Routing | Angular Router (lazy-loaded) | Route-level code splitting |
| Icons | `@angular/material` MatIcon | Consistent with Material |
| Auth | JWT Bearer (same as backend) | Interceptor-based token injection |
| API | Hand-written Angular services (no codegen) | Matches backend CQRS endpoint contracts |

---

## 2. Project Structure

```
clients/cms-dashboard/
├── angular.json
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts                          # Bootstrap
│   ├── index.html
│   ├── styles.scss                      # Tailwind + Material theme
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── app/
│   │   ├── app.component.ts             # Root shell
│   │   ├── app.routes.ts                # Top-level routes
│   │   ├── app.config.ts                # provideRouter, provideHttpClient, etc.
│   │   ├── core/
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts          # JWT token injection
│   │   │   │   └── error.interceptor.ts         # Global error handling
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts              # Login, token, current user
│   │   │   │   └── auth.guard.ts                # Route guard
│   │   │   └── layout/
│   │   │       ├── admin-layout.component.ts    # Shell with sidebar + toolbar
│   │   │       └── sidebar.component.ts
│   │   ├── shared/
│   │   │   ├── models/
│   │   │   │   ├── page.model.ts                # PageDto, CreatePageDto, etc.
│   │   │   │   ├── layout.model.ts              # LayoutDto, CreateLayoutDto, etc.
│   │   │   │   ├── block.model.ts               # BlockDto, BlockType enum
│   │   │   │   └── search.model.ts              # SearchPagesQuery, PagedPagesDto
│   │   │   ├── services/
│   │   │   │   └── api.service.ts               # Base API service (HttpClient wrapper)
│   │   │   ├── components/
│   │   │   │   ├── confirm-dialog/
│   │   │   │   ├── pagination/
│   │   │   │   └── page-status-badge/
│   │   │   └── pipes/
│   │   │       └── truncate.pipe.ts
│   │   ├── features/
│   │   │   ├── pages/
│   │   │   │   ├── page-list/
│   │   │   │   │   ├── page-list.component.ts       # DataTable with search/filter
│   │   │   │   │   └── page-list.routes.ts
│   │   │   │   ├── page-editor/
│   │   │   │   │   ├── page-editor.component.ts      # Full page edit form
│   │   │   │   │   ├── page-editor.routes.ts
│   │   │   │   │   ├── block-editor/
│   │   │   │   │   │   ├── block-editor.component.ts  # Drag-drop block builder
│   │   │   │   │   │   ├── block-renderer.component.ts # Preview blocks
│   │   │   │   │   │   └── block-forms/
│   │   │   │   │   │       ├── hero-block.form.ts
│   │   │   │   │   │       ├── text-block.form.ts
│   │   │   │   │   │       ├── banner-block.form.ts
│   │   │   │   │   │       ├── gallery-block.form.ts
│   │   │   │   │   │       ├── product-grid-block.form.ts
│   │   │   │   │   │       ├── cta-block.form.ts
│   │   │   │   │   │       ├── video-block.form.ts
│   │   │   │   │   │       └── custom-html-block.form.ts
│   │   │   │   │   ├── seo-form/
│   │   │   │   │   │   └── seo-form.component.ts   # Meta title, desc, OG tags
│   │   │   │   │   └── page-settings/
│   │   │   │   │       └── page-settings.component.ts # Slug, type, layout, publish
│   │   │   │   └── page-detail/
│   │   │   │       ├── page-detail.component.ts     # Read-only preview
│   │   │   │       └── page-detail.routes.ts
│   │   │   ├── layouts/
│   │   │   │   ├── layout-list/
│   │   │   │   │   ├── layout-list.component.ts
│   │   │   │   │   └── layout-list.routes.ts
│   │   │   │   ├── layout-editor/
│   │   │   │   │   ├── layout-editor.component.ts
│   │   │   │   │   └── layout-editor.routes.ts
│   │   │   │   └── layout-detail/
│   │   │   │       ├── layout-detail.component.ts
│   │   │   │       └── layout-detail.routes.ts
│   │   │   └── search/
│   │   │       ├── search.component.ts              # Full-text search with filters
│   │   │       └── search.routes.ts
│   │   └── services/
│   │       ├── page.service.ts              # CRUD + publish/unpublish API calls
│   │       ├── layout.service.ts            # Layout CRUD API calls
│   │       └── search.service.ts            # Search API calls
│   └── assets/
│       └── icons/
├── tailwind.config.js
└── proxy.conf.json                        # Dev proxy to API (https://localhost:7030)
```

---

## 3. Backend API Reference

All endpoints under the backend host (default `https://localhost:7030`).

### Pages

| Method | Route | Request Body | Response |
|--------|-------|-------------|----------|
| `POST` | `/api/v1/pages` | `CreatePageDto` | `Guid` (page ID) |
| `GET` | `/api/v1/pages?pageNumber=1&pageSize=10` | — | `PagedPagesDto` |
| `GET` | `/api/v1/pages/{id}` | — | `PageDto` |
| `GET` | `/api/v1/pages/slug/{slug}` | — | `PageDto` |
| `PUT` | `/api/v1/pages/{id}` | `UpdatePageDto` | `Guid` |
| `DELETE` | `/api/v1/pages/{id}` | — | `204 No Content` |
| `POST` | `/api/v1/pages/{id}/publish` | — | `204 No Content` |
| `POST` | `/api/v1/pages/{id}/unpublish` | — | `204 No Content` |

### Layouts

| Method | Route | Request Body | Response |
|--------|-------|-------------|----------|
| `POST` | `/api/v1/layouts` | `CreateLayoutDto` | `Guid` |
| `GET` | `/api/v1/layouts` | — | `List<LayoutDto>` |
| `GET` | `/api/v1/layouts/{id}` | — | `LayoutDto` |
| `PUT` | `/api/v1/layouts/{id}` | `UpdateLayoutDto` | `Guid` |
| `DELETE` | `/api/v1/layouts/{id}` | — | `204 No Content` |

### Search

| Method | Route | Query Params | Response |
|--------|-------|-------------|----------|
| `POST` | `/api/v1/search/pages` | `searchTerm, pageNumber, pageSize, pageType, sortBy` | `PagedPagesDto` |

### DTOs

```typescript
// PageDto
interface PageDto {
  id: string;
  name: string;
  slug: string;
  pageType: 'LandingPage' | 'ProductPage' | 'CategoryPage' | 'Custom';
  layoutId: string | null;
  content: string | null;     // JSON block array
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

// CreatePageDto
interface CreatePageDto {
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

// UpdatePageDto (same shape as CreatePageDto)

// LayoutDto
interface LayoutDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  blocks: string | null;     // JSON block template
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// CreateLayoutDto
interface CreateLayoutDto {
  name: string;
  slug: string;
  description?: string;
  blocks?: string;
  isDefault?: boolean;
}

// UpdateLayoutDto (same shape as CreateLayoutDto)

// BlockDto (embedded in Page.Content JSON)
interface BlockDto {
  blockId: string;
  blockType: BlockType;
  title: string | null;
  data: Record<string, any>;  // Type-specific config
  sortOrder: number;
  isVisible: boolean;
}

type BlockType =
  | 'Hero' | 'Banner' | 'Text' | 'ImageGallery'
  | 'ProductGrid' | 'Cta' | 'Video' | 'CustomHtml';

// PagedPagesDto
interface PagedPagesDto {
  items: PageDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}
```

---

## 4. Routes

```typescript
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'pages', pathMatch: 'full' },

      // Pages
      { path: 'pages', loadChildren: () => import('./features/pages/page-list/page-list.routes') },
      { path: 'pages/new', loadChildren: () => import('./features/pages/page-editor/page-editor.routes') },
      { path: 'pages/:id/edit', loadChildren: () => import('./features/pages/page-editor/page-editor.routes') },
      { path: 'pages/:id', loadChildren: () => import('./features/pages/page-detail/page-detail.routes') },

      // Layouts
      { path: 'layouts', loadChildren: () => import('./features/layouts/layout-list/layout-list.routes') },
      { path: 'layouts/new', loadChildren: () => import('./features/layouts/layout-editor/layout-editor.routes') },
      { path: 'layouts/:id/edit', loadChildren: () => import('./features/layouts/layout-editor/layout-editor.routes') },
      { path: 'layouts/:id', loadChildren: () => import('./features/layouts/layout-detail/layout-detail.routes') },

      // Search
      { path: 'search', loadChildren: () => import('./features/search/search.routes') },
    ],
  },
];
```

---

## 5. Implementation Phases

### Phase 1: Project Scaffolding
1. `ng new cms-dashboard --style=scss --routing --ssr=false`
2. Install dependencies:
   ```bash
   ng add @angular/material
   npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
   ```
3. Configure `proxy.conf.json` to proxy `/api` to `https://localhost:7030`
4. Set up `environment.ts` with API base URL
5. Configure Material theme (dark/light) in `styles.scss`
6. Configure Tailwind in `tailwind.config.js`

### Phase 2: Core Infrastructure
1. **Auth service** — login, logout, token storage, current user signal
2. **JWT interceptor** — attach `Authorization: Bearer <token>` to all requests
3. **Error interceptor** — global error toast/snackbar for failed requests
4. **Admin layout** — sidebar navigation + top toolbar shell
5. **API base service** — typed `HttpClient` wrapper with error handling

### Phase 3: Page Management
1. **Page list** — Material DataTable with columns: Name, Type, Status, UpdatedAt, Actions
   - Server-side pagination via `GET /api/v1/pages`
   - Search bar (calls `GET /api/v1/pages?search=...`)
   - Filter by pageType dropdown
   - Status badge (Published/Draft)
   - Row actions: Edit, Delete (with confirm dialog), Publish/Unpublish toggle
2. **Page editor** — Reactive Form with tabs:
   - **Content tab**: Block editor (add/remove/reorder blocks, each block has its own form)
   - **SEO tab**: Meta title, description, keywords, canonical URL, OG tags
   - **Settings tab**: Page name, slug (auto-generated from name), type, layout selector, sort order, featured image
   - **Preview tab**: Live preview of rendered blocks
3. **Page detail** — Read-only view of a page with block preview

### Phase 4: Block Editor
1. **Block list** — Sortable list of blocks in the page (drag & drop via `@angular/cdk/drag-drop`)
2. **Add block** — Dialog with block type selector (Hero, Text, Banner, etc.)
3. **Block forms** — Dynamic form per block type:
   - `HeroBlock`: heading, subheading, backgroundImage, ctaText, ctaLink
   - `TextBlock`: htmlContent (rich text), alignment
   - `BannerBlock`: image, altText, link, width, height
   - `ImageGalleryBlock`: images array (url, alt, caption)
   - `ProductGridBlock`: productIds, columns, showPrices
   - `CtaBlock`: heading, subheading, buttonText, buttonLink, style
   - `VideoBlock`: videoUrl, posterImage, autoplay
   - `CustomHtmlBlock`: htmlContent (code editor)
4. **Block renderer** — Live preview of each block (read-only render)
5. **Block visibility** — Toggle each block's `isVisible` flag

### Phase 5: Layout Management
1. **Layout list** — Material DataTable (Name, Slug, IsDefault, Actions)
2. **Layout editor** — Form: name, slug, description, blocks JSON editor, isDefault toggle
3. **Layout detail** — Read-only view

### Phase 6: Search
1. **Search page** — Full-text search with:
   - Search input (debounced, calls `POST /api/v1/search/pages`)
   - Page type filter dropdown
   - Sort dropdown (Relevance, Name, Date)
   - Results displayed as cards or table rows
   - Pagination

### Phase 7: Polish & Testing
1. Loading states (skeleton screens)
2. Error states (empty states, 404, 500)
3. Toast notifications for CRUD success/failure
4. Responsive design (mobile sidebar toggle)
5. Unit tests for services and key components
6. E2E tests for critical flows (create page, edit blocks, publish)

---

## 6. Dev Proxy Configuration

```json
// proxy.conf.json
{
  "/api": {
    "target": "https://localhost:7030",
    "secure": false,
    "changeOrigin": true
  }
}
```

Start with: `ng serve --proxy-config proxy.conf.json`

---

## 7. Key Angular Services

### PageService
```typescript
@Injectable({ providedIn: 'root' })
export class PageService {
  private http = inject(HttpClient);
  private base = '/api/v1/pages';

  getPages(params: { pageNumber: number; pageSize: number; search?: string; pageType?: string }) {
    return this.http.get<PagedPagesDto>(this.base, { params: toHttpParams(params) });
  }

  getPageById(id: string) {
    return this.http.get<PageDto>(`${this.base}/${id}`);
  }

  getPageBySlug(slug: string) {
    return this.http.get<PageDto>(`${this.base}/slug/${slug}`);
  }

  createPage(dto: CreatePageDto) {
    return this.http.post<Guid>(this.base, dto);
  }

  updatePage(id: string, dto: UpdatePageDto) {
    return this.http.put<Guid>(`${this.base}/${id}`, dto);
  }

  deletePage(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  publishPage(id: string) {
    return this.http.post<void>(`${this.base}/${id}/publish`, {});
  }

  unpublishPage(id: string) {
    return this.http.post<void>(`${this.base}/${id}/unpublish`, {});
  }
}
```

### LayoutService
```typescript
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private http = inject(HttpClient);
  private base = '/api/v1/layouts';

  getLayouts() {
    return this.http.get<LayoutDto[]>(this.base);
  }

  getLayoutById(id: string) {
    return this.http.get<LayoutDto>(`${this.base}/${id}`);
  }

  createLayout(dto: CreateLayoutDto) {
    return this.http.post<Guid>(this.base, dto);
  }

  updateLayout(id: string, dto: UpdateLayoutDto) {
    return this.http.put<Guid>(`${this.base}/${id}`, dto);
  }

  deleteLayout(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
```

### SearchService
```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  private base = '/api/v1/search/pages';

  searchPages(params: SearchPagesParams) {
    return this.http.post<PagedPagesDto>(this.base, null, { params: toHttpParams(params) });
  }
}
```

---

## 8. Environment Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7030',
  authBaseUrl: 'https://localhost:7030/api/v1',
};

// environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: '/api',
  authBaseUrl: '/api/v1',
};
```

---

## 9. Angular Material Theme

```scss
// styles.scss
@use '@angular/material' as mat;

html {
  @include mat.core();
}

$dashboard-primary: mat.m2-define-palette(mat.$m2-indigo-palette);
$dashboard-accent: mat.m2-define-palette(mat.$m2-pink-palette);
$dashboard-warn: mat.m2-define-palette(mat.$m2-red-palette);

$dashboard-theme: mat.m2-define-light-theme((
  color: (
    primary: $dashboard-primary,
    accent: $dashboard-accent,
    warn: $dashboard-warn,
  ),
  typography: mat.m2-define-typography-config(),
));

@include mat.all-component-themes($dashboard-theme);

@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 10. Build & Run

```bash
cd clients/cms-dashboard

# Install
npm install

# Dev (with proxy to backend)
ng serve --proxy-config proxy.conf.json
# → http://localhost:4200

# Production build
ng build --configuration production
# Output: dist/cms-dashboard/
```

---

## 11. File Creation Order (Recommended)

Follow this order to build incrementally:

1. `ng new` scaffold + install deps
2. `environment.ts` + `proxy.conf.json`
3. `core/auth/auth.service.ts` + `auth.interceptor.ts` + `auth.guard.ts`
4. `core/layout/admin-layout.component.ts` + `sidebar.component.ts`
5. `shared/models/` — all TypeScript interfaces matching backend DTOs
6. `services/page.service.ts` + `layout.service.ts` + `search.service.ts`
7. `features/pages/page-list/` — DataTable with pagination
8. `features/pages/page-editor/` — Form with tabs (content, SEO, settings)
9. `features/pages/page-editor/block-editor/` — Block CRUD + drag-drop
10. `features/pages/page-editor/block-editor/block-forms/` — Per-block-type forms
11. `features/pages/page-editor/block-editor/block-renderer.component.ts`
12. `features/pages/page-editor/seo-form/` + `page-settings/`
13. `features/layouts/` — Layout list + editor
14. `features/search/` — Search page
15. Polish: loading states, error toasts, responsive
16. Tests
