import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'products',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/products/product-list/product-list.component').then(
            (m) => m.ProductListComponent,
          ),
      },
      {
        path: 'products/add',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/products/product-add/product-add.component').then(
            (m) => m.ProductAddComponent,
          ),
      },
      {
        path: 'products/edit/:id',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/products/product-add/product-add.component').then(
            (m) => m.ProductAddComponent,
          ),
      },
      {
        path: 'categories',
        canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/categories/category-list/category-list.component').then(
            (m) => m.CategoryListComponent,
          ),
      },
      {
        path: 'categories/add',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/categories/category-add/category-add.component').then(
            (m) => m.CategoryAddComponent,
          ),
      },
      {
        path: 'categories/edit/:id',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/categories/category-edit/category-edit.component').then(
            (m) => m.CategoryEditComponent,
          ),
      },
      {
        path: 'brands',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/brands/brand-list/brand-list.component').then(
            (m) => m.BrandListComponent,
          ),
      },
      {
        path: 'brands/add',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/brands/brand-add/brand-add.component').then((m) => m.BrandAddComponent),
      },
      {
        path: 'brands/edit/:id',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/brands/brand-edit/brand-edit.component').then(
            (m) => m.BrandEditComponent,
          ),
      },
      {
        path: 'product-options',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/product-options/product-option-list/product-option-list.component').then(
            (m) => m.ProductOptionListComponent,
          ),
      },
      {
        path: 'product-options/add',
         canActivate:[authGuard],
        loadComponent: () =>
          import('./pages/product-options/product-option-add/product-option-add.component').then(
            (m) => m.ProductOptionAddComponent,
          ),
      },
      {
        path: 'product-options/edit/:id',
        loadComponent: () =>
          import('./pages/product-options/product-option-edit/product-option-edit.component').then(
            (m) => m.ProductOptionEditComponent,
          ),
      },
      {
        path: 'attributes',
        loadComponent: () =>
          import('./pages/attributes/product-attribute-list/product-attribute-list.component').then(
            (m) => m.ProductAttributeListComponent,
          ),
      },
      {
        path: 'attributes/add',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/attributes/product-attribute-add/product-attribute-add.component').then(
            (m) => m.ProductAttributeAddComponent,
          ),
      },
      {
        path: 'attribute-groups',
        loadComponent: () =>
          import('./pages/attributes/attribute-group-list/attribute-group-list.component').then(
            (m) => m.AttributeGroupListComponent,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders/order-list/order-list.component').then(
            (m) => m.OrderListComponent,
          ),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./pages/orders/order-details/order-details.component').then(
            (m) => m.OrderDetailsComponent,
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/customers/customer-list/customer-list.component').then(
            (m) => m.CustomerListComponent,
          ),
      },

      {   path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
       {   path: 'register',
        loadComponent: () =>
          import('./pages/auth/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
       {
         path: 'profile',
         canActivate:[authGuard],
         loadComponent: () =>
           import('./pages/profile/user-profile/user-profile.component').then(
             (m) => m.UserProfileComponent,
           ),
       },
       {
         path: 'site/settings',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'site/store-info',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'inventory/stock',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'inventory/warehouses',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'promotions/coupons',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'promotions/discounts',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'content/pages',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'content/banners',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'system/users',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'system/settings',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'system/logs',
        loadComponent: () =>
          import('./pages/shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
    ],
  },
];
