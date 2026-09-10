import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { OrderService } from '../order-service';
import { Order } from '../order';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-order-list',
  styleUrl: './order-list.scss',
  templateUrl: './order-list.html',
})
export class OrderList implements OnInit {
  private orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  columns: DataGridColumn[] = [
    { key: 'orderId', header: 'Order ID', sortable: true, type: 'number' },
    { key: 'customerName', header: 'Customer', sortable: true, type: 'text' },
    { key: 'employeeName', header: 'Employee', sortable: true, type: 'text' },
    { key: 'orderDate', header: 'Order Date', sortable: true, type: 'text' },
    { key: 'freight', header: 'Freight', sortable: true, type: 'text' },
    { key: 'shipCountry', header: 'Ship Country', sortable: true, type: 'text' },
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
      { label: 'Items', action: 'items', cssClass: 'edit-button' },
      { label: 'Edit', action: 'edit', cssClass: 'edit-button' },
      { label: 'Delete', action: 'delete', cssClass: 'delete-button' },
    ];
  });

  orders = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('orderId');
  sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService
      .getOrders(
        this.searchText(),
        this.sortColumn(),
        this.sortDirection(),
        this.currentPage(),
        this.pageSize(),
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

  onGridAction(event: { action: string; row: Order }): void {
    switch (event.action) {
      case 'items':
        this.router.navigate(['/orders/details', event.row.orderId]);
        break;
      case 'edit':
        this.router.navigate(['/orders/edit', event.row.orderId]);
        break;
      case 'delete':
        this.deleteOrder(event.row.orderId!);
        break;
    }
  }

  deleteOrder(orderId: number): void {
    if (!confirm(`Delete order ${orderId}?`)) {
      return;
    }

    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.toast.success('Order deleted successfully.');
        this.loadOrders();
      },
      error: (error) => {
        this.toast.error('Failed to delete order. It may have order details.');
        console.error('Error deleting order:', error);
      },
    });
  }

  onAddOrder(): void {
    this.router.navigate(['/orders/new']);
  }
}