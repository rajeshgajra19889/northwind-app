import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { DataGrid, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { OrderService } from '../../order/order-service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-customer-orders',
  styleUrl: './customer-orders.scss',
  templateUrl: './customer-orders.html',
})
export class CustomerOrders {
  private customerService = inject(CustomerService);
  private orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  customer = signal<any | null>(null);
  orders = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('orderId');
  sortDirection = signal<'asc' | 'desc'>('asc');

  columns: DataGridColumn[] = [
    { key: 'orderId', header: 'Order ID', sortable: true, type: 'number' },
    { key: 'employeeName', header: 'Employee', sortable: true, type: 'text' },
    { key: 'orderDate', header: 'Order Date', sortable: true, type: 'date' },
    { key: 'requiredDate', header: 'Required Date', sortable: true, type: 'date' },
    { key: 'shippedDate', header: 'Shipped Date', sortable: true, type: 'date' },
    { key: 'freight', header: 'Freight', sortable: true, type: 'number' },
    { key: 'shipCity', header: 'Ship City', sortable: true, type: 'text' },
    { key: 'shipCountry', header: 'Ship Country', sortable: true, type: 'text' },
  ];

  actions = computed(() => []);

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadCustomer(currentId);
        this.loadOrders();
      }
    });
  }

  private loadCustomer(id: string): void {
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => this.customer.set(customer),
      error: (error) => {
        this.toast.error('Failed to load customer details.');
        console.error('Error loading customer:', error);
      },
    });
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService
      .getOrders(
        this.searchText(),
        this.sortColumn(),
        this.sortDirection(),
        this.currentPage(),
        this.pageSize(),
        undefined,
        this.id(),
      )
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.orders.set(res.data);
          this.totalPages.set(res.totalPages);
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error('Failed to load orders.');
          console.error('Error loading orders:', error);
        },
      });
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadOrders();
  }

  onSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
    this.loadOrders();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadOrders();
    }
  }

  onBack(): void {
    this.router.navigate(['/customers']);
  }
}