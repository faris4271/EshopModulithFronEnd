# EshopModulith Frontend — Admin Dashboard

> A modern, responsive **Angular 21** administrative dashboard for managing the E-shop, built with **standalone components**, **TailwindCSS**, and **TypeScript**.

![Angular Version](https://img.shields.io/badge/Angular-21-DD0031)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4)
![Node](https://img.shields.io/badge/Node.js-20%2B-339933)

---

## 🎯 Overview

**EshopModulith Frontend** is a comprehensive admin dashboard application for managing the e-commerce platform. Built with Angular 21's modern standalone components architecture, it provides a clean, type-safe interface for managing products, users, orders, and inventory. The UI is crafted using TailwindCSS for a professional, responsive design.

### Key Features

✅ **Standalone Components** - Modern Angular architecture without NgModule  
✅ **Responsive Design** - TailwindCSS utility-first styling  
✅ **Global Error Handling** - Centralized HTTP error management  
✅ **Toast Notifications** - User-friendly feedback with ngx-toastr  
✅ **Typed API Integration** - Strong TypeScript support  
✅ **Modular Services** - Clean separation of concerns  
✅ **Interceptors** - HTTP request/response middleware  
✅ **Development Mode** - Hot module reloading with `ng serve`  
✅ **Production Ready** - Optimized build configuration  

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Features](#features)
- [Development](#development)
- [Building & Deployment](#building--deployment)
- [Services & Interceptors](#services--interceptors)
- [Contributing](#contributing)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** - 20 LTS or higher ([Download](https://nodejs.org/))
- **npm** - 11.0 or higher (comes with Node.js)
- **Angular CLI** - 21.2.6 (installed via npm)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/faris4271/EshopModulithFronEnd.git
cd EshopModulithFronEnd

# Install dependencies
npm install

# Start the development server
npm start

# Build for production
npm run build
```

The application will be available at:
- **Development**: http://localhost:4200
- **API Base URL**: https://localhost:5001 (from EshopModulith backend)

---

## 📁 Project Structure

```
EshopModulithFronEnd/
├── src/
│   ├── app/
│   │   ├── pages/                    # Feature page components
│   │   │   ├── dashboard/           # Dashboard landing page
│   │   │   ├── products/            # Product management
│   │   │   ├── orders/              # Order management
│   │   │   ├── users/               # User management
│   │   │   ├── categories/          # Category management
│   │   │   └── settings/            # Admin settings
│   │   │
│   │   ├── services/                # Business logic & API calls
│   │   │   ├── api.service.ts       # Main API service
│   │   │   ├── product.service.ts   # Product operations
│   │   │   ├── order.service.ts     # Order operations
│   │   │   ├── user.service.ts      # User management
│   │   │   ├── auth.service.ts      # Authentication
│   │   │   └── toast.service.ts     # Toast notifications
│   │   │
│   │   ├── interceptors/            # HTTP interceptors
│   │   │   ├── error.interceptor.ts # Global error handling
│   │   │   ├── auth.interceptor.ts  # JWT token injection
│   │   │   └── loading.interceptor.ts # Loading state management
│   │   │
│   │   ├── models/                  # TypeScript interfaces & DTOs
│   │   │   ├── product.model.ts     # Product interfaces
│   │   │   ├── order.model.ts       # Order interfaces
│   │   │   ├── user.model.ts        # User interfaces
│   │   │   └── api-response.model.ts # Common API response types
│   │   │
│   │   ├── shared/                  # Shared components & utilities
│   │   │   ├── components/          # Reusable components
│   │   │   │   ├── header/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── footer/
│   │   │   │   └── pagination/
│   │   │   ├── pipes/               # Custom pipes
│   │   │   └── directives/          # Custom directives
│   │   │
│   │   ├── app.config.ts            # App configuration
│   │   ├── app.routes.ts            # Route configuration
│   │   └── app.component.ts         # Root component
│   │
│   ├── styles.css                   # Global styles
│   ├── main.ts                      # Entry point
│   └── index.html                   # HTML template
│
├── public/                           # Static assets
├── angular.json                      # Angular CLI configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── README.md                         # This file
├── AGENTS.md                         # AI agent guidelines
└── .gitignore                        # Git ignore rules
```

---

## 🏗️ Architecture

### Standalone Components Architecture

The project follows Angular 21's modern standalone components pattern, eliminating the need for `NgModule`:

```typescript
// Example: Standalone component
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products$ = this.productService.getProducts();
  
  constructor(private productService: ProductService) {}
}
```

### Global Error Handling

**Toast Service** - Centralized notification system:

```typescript
// Example: Toast notification
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(message: string) {
    this.toastr.success(message);
  }

  error(message: string) {
    this.toastr.error(message);
  }

  info(message: string) {
    this.toastr.info(message);
  }
}
```

**Error Interceptor** - Automatic error catching:

```typescript
// Example: HTTP error interceptor
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastService.error(error.error.message || 'An error occurred');
        return throwError(() => error);
      })
    );
  }
}
```

### Module Communication Flow

```
┌──────────────────────┐
│   Angular Component  │
│ (Standalone)         │
└──────────┬───────────┘
           │
    ┌──────▼──────┐
    │   Services  │
    │ (API Logic) │
    └──────┬──────┘
           │
    ┌──────▼────────────┐
    │  HTTP Interceptors│
    │ (Error, Auth,...)│
    └──────┬────────────┘
           │
    ┌──────▼─────────────┐
    │  Backend API       │
    │ (EshopModulith)    │
    └────────────────────┘
```

---

## 💻 Development

### Running the Development Server

```bash
# Start development server with hot reload
npm start

# Access at http://localhost:4200
# API calls to https://localhost:5001
```

### Creating New Components

```bash
# Generate standalone component
ng generate component pages/products/product-list

# The CLI automatically creates standalone components
# No need to add to module declarations
```

### Adding Services

```bash
# Generate service
ng generate service services/product

# Automatically provided in root injector
```

### Development Best Practices

1. **Use Standalone Components** - Don't create NgModules
2. **Typed Services** - Always define interfaces/models
3. **HTTP Error Handling** - Use the error interceptor
4. **Toast Notifications** - Use ToastService for user feedback
5. **RxJS Patterns** - Use Observables and async pipe
6. **Code Organization** - Follow the folder structure

### Example: Product Management Component

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ToastService } from '../../../services/toast.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Products</h1>
      
      <button 
        (click)="addProduct()" 
        class="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        Add Product
      </button>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let product of products$ | async" class="border rounded p-4">
          <h3 class="font-bold">{{ product.name }}</h3>
          <p class="text-gray-600">{{ product.price | currency }}</p>
          <button 
            (click)="editProduct(product)" 
            class="text-blue-600">Edit</button>
          <button 
            (click)="deleteProduct(product.id)" 
            class="text-red-600 ml-2">Delete</button>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products$ = this.productService.getProducts();

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.products$ = this.productService.getProducts();
  }

  addProduct() {
    // Navigate to add product page
  }

  editProduct(product: Product) {
    // Navigate to edit product page
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.toastService.success('Product deleted successfully');
      this.loadProducts();
    });
  }
}
```

---

## 🏗️ Building & Deployment

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Output in: dist/esop-admin/
```

### Build Optimizations

- AOT (Ahead-of-Time) compilation enabled
- Bundle size optimization
- Tree-shaking of unused code
- Minification and compression

### Deploy to Production

```bash
# Docker deployment example
docker build -t esop-admin-frontend:latest .
docker run -p 80:4200 esop-admin-frontend:latest
```

### Environment Configuration

Create `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};

export const environments = {
  production: {
    apiUrl: 'https://api.example.com'
  }
};
```

---

## 🔌 Services & Interceptors

### API Service Example

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'https://localhost:5001/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### HTTP Interceptors

**App Configuration** with interceptors:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors/error.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ]
};
```

---

## 📚 TypeScript Models

### Product Model

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
  categoryId: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
}
```

### Order Model

```typescript
export interface Order {
  id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled'
}
```

---

## 📚 Additional Resources

- **[AGENTS.md](./AGENTS.md)** - AI agent guidelines
- **[Angular 21 Documentation](https://angular.dev/)** - Official Angular docs
- **[TailwindCSS Docs](https://tailwindcss.com/)** - Styling guide
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Type definitions
- **[RxJS Documentation](https://rxjs.dev/)** - Reactive programming

---

## 📜 Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (http://localhost:4200) |
| `npm run build` | Build for production |
| `npm run watch` | Watch mode for development |
| `npm test` | Run unit tests (Karma/Jasmine) |
| `npm run build -- --configuration production` | Production build with optimizations |

---

## 🤝 Contributing

We welcome contributions! Please:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Follow the structure** defined in this README
4. **Use standalone components** - Don't create NgModules
5. **Add type definitions** - Use interfaces for API responses
6. **Test locally**: `npm start`
7. **Submit a PR** with a clear description

### Coding Standards

- Use **PascalCase** for component selectors and class names
- Use **camelCase** for properties and methods
- Add **@Component**, **@Injectable**, etc. decorators
- Keep components **under 300 lines**
- Extract logic to **Services**
- Use **async pipe** in templates
- Follow **folder structure**

---

## 🎨 TailwindCSS Styling

### Tailwind Configuration

TailwindCSS is configured via `tailwindcss.config.js`:

```javascript
export default {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
```

### Using TailwindCSS in Components

```html
<div class="container mx-auto p-6">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="card bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Card Title</h2>
      <p class="text-gray-600">Card content</p>
    </div>
  </div>
</div>
```

---

## 📝 License

This project is open source and available under an appropriate license.

---

## 💬 Support

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/faris4271/EshopModulithFronEnd/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/faris4271/EshopModulithFronEnd/discussions)

---

## 🚀 Project Roadmap

- ✅ Core dashboard setup
- ✅ Product management pages
- ✅ Global error handling
- ✅ Toast notifications
- 🔄 Order management (in progress)
- 📋 User management (planned)
- 📋 Analytics dashboard (planned)
- 📋 Real-time notifications (planned)
- 📋 Admin reports (planned)

---

## 🔗 Related Repositories

- **Backend API**: [EshopModulith](https://github.com/faris4271/EshopModulith) - .NET modular monolith
- **Project**: E-Commerce Platform built with modern architecture

---

**Built with ❤️ using Angular 21 & TailwindCSS**

*Modern, scalable, and maintainable admin dashboard for e-commerce management.*
