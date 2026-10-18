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
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/product-list/product-list.component').then(
            (m) => m.ProductListComponent,
          ),
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./pages/products/product-add/product-add.component').then(
            (m) => m.ProductAddComponent,
          ),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./pages/products/product-add/product-add.component').then(
            (m) => m.ProductAddComponent,
          ),
      },
      {
        path: 'vendors',
        loadComponent: () =>
          import('./pages/vendors/vendor-list/vendor-list.component').then(
            (m) => m.VendorListComponent,
          ),
      },
      {
        path: 'vendors/add',
        loadComponent: () =>
          import('./pages/vendors/vendor-add/vendor-add.component').then(
            (m) => m.VendorAddComponent,
          ),
      },
      {
        path: 'vendors/edit/:id',
        loadComponent: () =>
          import('./pages/vendors/vendor-edit/vendor-edit.component').then(
            (m) => m.VendorEditComponent,
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/category-list/category-list.component').then(
            (m) => m.CategoryListComponent,
          ),
      },
      {
        path: 'categories/add',
        loadComponent: () =>
          import('./pages/categories/category-add/category-add.component').then(
            (m) => m.CategoryAddComponent,
          ),
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () =>
          import('./pages/categories/category-edit/category-edit.component').then(
            (m) => m.CategoryEditComponent,
          ),
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./pages/brands/brand-list/brand-list.component').then(
            (m) => m.BrandListComponent,
          ),
      },
      {
        path: 'brands/add',
        loadComponent: () =>
          import('./pages/brands/brand-add/brand-add.component').then((m) => m.BrandAddComponent),
      },
      {
        path: 'brands/edit/:id',
        loadComponent: () =>
          import('./pages/brands/brand-edit/brand-edit.component').then(
            (m) => m.BrandEditComponent,
          ),
      },
      {
        path: 'product-options',
        loadComponent: () =>
          import('./pages/product-options/product-option-list/product-option-list.component').then(
            (m) => m.ProductOptionListComponent,
          ),
      },
      {
        path: 'product-options/add',
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
        path: 'attributes/templates',
        loadComponent: () =>
          import('./pages/attributes/product-attribute-template-list/product-attribute-template-list.component').then(
            (m) => m.ProductAttributeTemplateListComponent,
          ),
      },
      {
        path: 'attributes/templates/add',
        loadComponent: () =>
          import('./pages/attributes/product-attribute-template-add/product-attribute-template-add.component').then(
            (m) => m.ProductAttributeTemplateAddComponent,
          ),
      },
      {
        path: 'attributes/templates/edit/:id',
        loadComponent: () =>
          import('./pages/attributes/product-attribute-template-edit/product-attribute-template-edit.component').then(
            (m) => m.ProductAttributeTemplateEditComponent,
          ),
      },
      {
        path: 'attributes/add',
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
        path: 'attribute-groups/add',
        loadComponent: () =>
          import('./pages/attributes/attribute-group-add/attribute-group-add.component').then(
            (m) => m.AttributeGroupAddComponent,
          ),
      },
      {
        path: 'attribute-groups/edit/:id',
        loadComponent: () =>
          import('./pages/attributes/attribute-group-edit/attribute-group-edit.component').then(
            (m) => m.AttributeGroupEditComponent,
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
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent,
          ),
      },
      {
        path: 'site/settings',
        loadComponent: () =>
          import('./shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'inventory/stock',
        loadComponent: () =>
          import('./pages/inventory/stock-list/stock-list.component').then(
            (m) => m.StockListComponent,
          ),
      },
      {
        path: 'inventory/warehouses',
        loadComponent: () =>
          import('./shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
{
        path: 'promotions/cart-rule-usages',
        loadComponent: () =>
          import('./pages/cart-rule-usages/cart-rule-usage-list/cart-rule-usage-list.component').then(
            (m) => m.CartRuleUsageListComponent,
          ),
      },
      {
        path: 'promotions/discounts',
        loadComponent: () =>
          import('./shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'promotions/cart-price-rules',
        loadComponent: () =>
          import('./pages/cart-price-rules/cart-price-rule-list/cart-price-rule-list.component').then(
            (m) => m.CartPriceRuleListComponent,
          ),
      },
      {
        path: 'promotions/cart-price-rules/add',
        loadComponent: () =>
          import('./pages/cart-price-rules/cart-price-rule-add/cart-price-rule-add.component').then(
            (m) => m.CartPriceRuleAddComponent,
          ),
      },
      {
        path: 'promotions/cart-price-rules/edit/:id',
        loadComponent: () =>
          import('./pages/cart-price-rules/cart-price-rule-add/cart-price-rule-add.component').then(
            (m) => m.CartPriceRuleAddComponent,
          ),
      },
      {
        path: 'promotions/cart-rule-usages',
        loadComponent: () =>
          import('./pages/cart-rule-usages/cart-rule-usage-list/cart-rule-usage-list.component').then(
            (m) => m.CartRuleUsageListComponent,
          ),
      },
      {
        path: 'content/pages',
        loadComponent: () =>
          import('./pages/content/page-list/page-list.component').then((m) => m.PageListComponent),
      },
      {
        path: 'content/pages/add',
        loadComponent: () =>
          import('./pages/content/page-editor/page-editor.component').then((m) => m.PageEditorComponent),
      },
      {
        path: 'content/pages/edit/:id',
        loadComponent: () =>
          import('./pages/content/page-editor/page-editor.component').then((m) => m.PageEditorComponent),
      },
      {
        path: 'content/pages/:id',
        loadComponent: () =>
          import('./pages/content/page-detail/page-detail.component').then((m) => m.PageDetailComponent),
      },
      {
        path: 'content/banners',
        loadComponent: () =>
          import('./shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'content/layouts',
        loadComponent: () =>
          import('./pages/content/layout-list/layout-list.component').then((m) => m.LayoutListComponent),
      },
      {
        path: 'content/layouts/add',
        loadComponent: () =>
          import('./pages/content/layout-editor/layout-editor.component').then((m) => m.LayoutEditorComponent),
      },
      {
        path: 'content/layouts/edit/:id',
        loadComponent: () =>
          import('./pages/content/layout-editor/layout-editor.component').then((m) => m.LayoutEditorComponent),
      },
      {
        path: 'content/layouts/:id',
        loadComponent: () =>
          import('./pages/content/layout-detail/layout-detail.component').then((m) => m.LayoutDetailComponent),
      },
      {
        path: 'content/search',
        loadComponent: () =>
          import('./pages/content/search-page/search-page.component').then((m) => m.SearchPageComponent),
      },
       {
         path: 'system/users',
         loadComponent: () =>
           import('./pages/users/user-list/user-list.component').then(
             (m) => m.UserListComponent,
           ),
       },

      {
        path: 'system/settings',
        loadComponent: () =>
          import('./shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'system/logs',
        loadComponent: () =>
          import('./shared/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent,
          ),
      },
      {
        path: 'system/tax-classes',
        loadComponent: () =>
          import('./pages/tax-classes/tax-class-list/tax-class-list.component').then(
            (m) => m.TaxClassListComponent,
          ),
      },
      {
        path: 'system/tax-classes/add',
        loadComponent: () =>
          import('./pages/tax-classes/tax-class-add/tax-class-add.component').then(
            (m) => m.TaxClassAddComponent,
          ),
      },
      {
        path: 'system/tax-classes/edit/:id',
        loadComponent: () =>
          import('./pages/tax-classes/tax-class-edit/tax-class-edit.component').then(
            (m) => m.TaxClassEditComponent,
          ),
      },
    ],
  },

];
