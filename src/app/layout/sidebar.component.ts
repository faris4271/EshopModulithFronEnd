import { Component, model, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

export interface MenuItem {
  label: string;
  route?: string;
  icon?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  collapsed = model(false);

  openMenus = signal<Set<string>>(new Set());

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
    },
    {
      label: 'Site',
      icon: 'site',
      children: [
        { label: 'Settings', route: '/site/settings' },
        { label: 'Store Info', route: '/site/store-info' },
      ],
    },
    {
      label: 'Catalog',
      icon: 'catalog',
      children: [
        { label: 'Products', route: '/products' },
        { label: 'Categories', route: '/categories' },
        { label: 'Brands', route: '/brands' },
        { label: 'Product Options', route: '/product-options' },
        { label: 'Attributes', route: '/attributes' },
        { label: 'Attribute Groups', route: '/attribute-groups' },
      ],
    },
    {
      label: 'Sales',
      icon: 'sales',
      children: [
        { label: 'Orders', route: '/orders' },
        { label: 'Customers', route: '/customers' },
      ],
    },
    {
      label: 'Inventory',
      icon: 'inventory',
      children: [
        { label: 'Stock', route: '/inventory/stock' },
        { label: 'Warehouses', route: '/inventory/warehouses' },
      ],
    },
    {
      label: 'Promotions',
      icon: 'promotions',
      children: [
        { label: 'Coupons', route: '/promotions/coupons' },
        { label: 'Discounts', route: '/promotions/discounts' },
      ],
    },
    {
      label: 'Content',
      icon: 'content',
      children: [
        { label: 'Pages', route: '/content/pages' },
        { label: 'Banners', route: '/content/banners' },
      ],
    },
    {
      label: 'System',
      icon: 'system',
      children: [
        { label: 'Users', route: '/system/users' },
        { label: 'Settings', route: '/system/settings' },
        { label: 'Logs', route: '/system/logs' },
      ],
    },
  ];

  constructor(private router: Router) {}

  toggleCollapse(): void {
    this.collapsed.set(!this.collapsed());
  }

  toggleMenu(label: string): void {
    this.openMenus.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  }

  isMenuOpen(label: string): boolean {
    return this.openMenus().has(label);
  }

  isChildActive(children: MenuItem[]): boolean {
    return children.some((child) => {
      if (child.route) {
        return this.router.url.startsWith(child.route);
      }
      return false;
    });
  }
}
