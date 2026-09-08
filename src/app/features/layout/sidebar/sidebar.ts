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
      title: 'Customers',
      links: [
        { label: 'Customers', path: '/customers' }

      ]
    }
  ];
}
