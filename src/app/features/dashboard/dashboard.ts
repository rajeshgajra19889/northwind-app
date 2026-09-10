import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private readonly toast = inject(ToastService);

  loading = signal<boolean>(true);
  data = signal<any>(null);

  formatter = new Intl.NumberFormat('en-US');
  currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  today = new Date();

  greeting = computed<string>(() => {
    const hour = this.today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  stats = computed(() => {
    const s = this.data()?.stats;
    if (!s) return [];
    return [
      {
        label: 'Customers',
        value: Number(s.customers),
        footer:
          s.ordersMonthlyChange !== null && s.ordersMonthlyChange !== undefined
            ? this.changeText(s.ordersMonthlyChange)
            : 'All-time total',
        icon: this.icons.users,
        accent: 'indigo',
      },
      {
        label: 'Products',
        value: Number(s.products),
        footer: 'Active catalog',
        icon: this.icons.box,
        accent: 'teal',
      },
      {
        label: 'Orders',
        value: Number(s.orders),
        footer: 'All-time totals',
        icon: this.icons.cart,
        accent: 'amber',
      },
      {
        label: 'Employees',
        value: Number(s.employees),
        footer: 'Current staff',
        icon: this.icons.briefcase,
        accent: 'rose',
      },
    ];
  });

  salesMax = computed<number>(() => {
    const rows = this.data()?.salesOverview ?? [];
    return rows.reduce((m: number, r: any) => Math.max(m, r.revenue), 0);
  });

  orderStatus = computed(() => {
    const rows = this.data()?.orderStatus ?? [];
    const total = rows.reduce((sum: number, r: any) => sum + Number(r.count), 0) || 1;
    const colors: Record<string, string> = {
      'On Time': '#10b981',
      Late: '#f59e0b',
      Pending: '#6366f1',
    };
    let cumulative = 0;
    const stops = rows
      .map((r: any) => {
        const start = (cumulative / total) * 100;
        cumulative += Number(r.count);
        const end = (cumulative / total) * 100;
        return `${colors[r.status] ?? '#94a3b8'} ${start}% ${end}%`;
      })
      .join(', ');
    return {
      rows: rows.map((r: any) => ({
        status: r.status,
        count: Number(r.count),
        pct: Math.round((Number(r.count) / total) * 100),
        color: colors[r.status] ?? '#94a3b8',
      })),
      gradient: `conic-gradient(${stops})`,
    };
  });

  icons = {
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  };

  ngOnInit(): void {
    this.loadOverview();
  }

  loadOverview(): void {
    this.dashboardService.getOverview().subscribe({
      next: (data) => this.data.set(data),
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load dashboard data.');
        console.error('Error loading dashboard:', error);
      },
      complete: () => this.loading.set(false),
    });
  }

  changeText(change: number): string {
    return change > 0 ? `+${change}% vs last month` : `${change}% vs last month`;
  }

  barHeight(revenue: number): number {
    if (this.salesMax() === 0) return 0;
    return Math.max(3, Math.round((revenue / this.salesMax()) * 100));
  }
}