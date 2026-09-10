import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.scss',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  navGroups: NavGroup[] = [
    {
      title: 'Sales',
      links: [
        { label: 'Orders', path: '/orders' },
        { label: 'Customers', path: '/customers' },
      ],
    },
    {
      title: 'Products',
      links: [
        { label: 'Products', path: '/products' },
        { label: 'Categories', path: '/categories' },
        { label: 'Suppliers', path: '/suppliers' },
      ],
    },
    {
      title: 'Employees',
      links: [{ label: 'Employees', path: '/employees' }],
    },
    {
      title: 'Territories',
      links: [
        { label: 'Territories', path: '/territories' },
        { label: 'Regions', path: '/regions' },
      ],
    },
    {
      title: 'Shipping',
      links: [{ label: 'Shippers', path: '/shippers' }],
    },
    {
      title: 'Administration',
      links: [{ label: 'Settings', path: '/settings' }],
    },
  ];
}