# Agents Guidelines

## Framework & Architecture
- Framework: Angular 21 (Standalone architecture).
- Styling: TailwindCSS via `@tailwindcss/postcss`.
- Global styles: `src/styles.css`.
- Static assets: `public/` directory.

## Commands
- Use `npm` scripts for all tasks:
  - `npm start`: Run development server.
  - `npm run build`: Build the application.
  - `npm test`: Run tests.

## Project Structure
```
src/app/
├── app.config.ts              # App config (providers, router)
├── app.routes.ts              # Route definitions
├── app.ts                     # Root standalone component
├── app.html / app.css         # Root template & styles
├── guards/                    # Route guards
│   └── auth-guard.ts
├── interceptors/              # HTTP interceptors
│   ├── error.interceptor.ts
│   ├── refresh-token-interceptor.ts
│   └── spinner.interceptor.ts
├── layout/                    # App shell (navbar, sidebar, layout)
├── models/                    # Interfaces/types (Login, Order, Product, Stock, etc.)
├── pipes/                     # Custom pipes (full-image-url.pipe.ts)
├── services/                  # API services (one per domain entity)
├── utils/                     # Helpers (form-data.helper.ts)
├── shared/                    # Shared UI
│   └── components/            # Reusable dialogs (confirmation-dialog)
└── pages/                     # Feature modules (lazy-loaded route components)
    ├── attributes/            # Attribute groups & product attributes CRUD
    ├── auth/                  # Login & Register
    ├── brands/                # Brand CRUD
    ├── categories/            # Category CRUD
    ├── customers/             # Customer list
    ├── dashboard/             # Dashboard
    ├── inventory/             # Stock list & history
    ├── orders/                # Order list & details
    ├── product-options/       # Product option CRUD
    ├── products/              # Product CRUD (multi-tab add form with sub-services)
    ├── profile/               # User profile
    ├── shared/                # Shared page-level components
    ├── site/                  # Site settings
    └── vendors/               # Vendor list
```

### Conventions
- Each `pages/` feature follows pattern: `feature/feature-list/`, `feature/feature-add/`, `feature/feature-edit/`.
- `services/` mirrors domain entities: `product.service.ts`, `category.service.ts`, etc.
- `models/` contains TypeScript interfaces/types matching backend API DTOs.
- E-commerce admin dashboard: manages products, orders, inventory, customers, vendors, categories, brands, attributes, and product options.

## Project Quirks
- **Tests:** `angular.json` is configured with `"skipTests": true` for all schematics. `.spec.ts` files are not generated automatically. Agents must explicitly create test files if required.
