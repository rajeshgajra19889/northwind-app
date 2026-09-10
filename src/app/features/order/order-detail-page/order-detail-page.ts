import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { OrderService } from '../order-service';
import { OrderDetailService } from '../../order-detail/order-detail-service';
import { Order } from '../order';
import { OrderDetailListItem } from '../../order-detail/order-detail';
import { OrderDetailsModal } from '../../order-detail/order-details-modal/order-details-modal';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [CommonModule, DataGrid, OrderDetailsModal],
  selector: 'app-order-detail-page',
  styleUrl: './order-detail-page.scss',
  templateUrl: './order-detail-page.html',
})
export class OrderDetailPage {
  private orderService = inject(OrderService);
  private orderDetailService = inject(OrderDetailService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  order = signal<Order | null>(null);

  columns: DataGridColumn[] = [
    { key: 'productId', header: 'Product ID', sortable: true, type: 'number' },
    { key: 'productName', header: 'Product Name', sortable: true, type: 'text' },
    { key: 'unitPrice', header: 'Unit Price', sortable: true, type: 'currency' },
    { key: 'quantity', header: 'Quantity', sortable: true, type: 'number' },
    { key: 'discount', header: 'Discount', sortable: true, type: 'text' },
    { key: 'lineTotal', header: 'Line Total', sortable: false, type: 'currency' },
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
      { label: 'Edit', action: 'edit', cssClass: 'edit-button' },
      { label: 'Delete', action: 'delete', cssClass: 'delete-button' },
    ];
  });

  items = signal<OrderDetailListItem[]>([]);
  gridLoading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('productId');
  sortDirection = signal<'asc' | 'desc'>('asc');

  showModal = signal<boolean>(false);
  editingItem = signal<OrderDetailListItem | null>(null);

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadOrderHeader(currentId);
        this.loadItems();
      }
    });
  }

  private loadOrderHeader(id: string): void {
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        const typed = order as any;
        this.order.set({
          ...order,
          customerName: typed.customer?.companyName ?? typed.customerId ?? null,
          employeeName: typed.employee
            ? `${typed.employee.firstName} ${typed.employee.lastName}`
            : null,
        });
      },
      error: (error) => {
        this.toast.error('Failed to load order details.');
        console.error('Error loading order:', error);
      },
    });
  }

  loadItems(): void {
    this.gridLoading.set(true);
    const orderId = parseInt(this.id()!, 10);
    this.orderDetailService
      .getOrderDetails(
        this.searchText(),
        this.sortColumn(),
        this.sortDirection(),
        this.currentPage(),
        this.pageSize(),
        orderId,
      )
      .subscribe({
        next: (res) => {
          this.gridLoading.set(false);
          this.items.set(res.data);
          this.totalPages.set(res.totalPages);
        },
        error: (error) => {
          this.gridLoading.set(false);
          this.toast.error('Failed to load order items.');
          console.error('Error loading order items:', error);
        },
      });
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadItems();
  }

  onSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
    this.loadItems();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadItems();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadItems();
    }
  }

  onGridAction(event: { action: string; row: OrderDetailListItem }): void {
    switch (event.action) {
      case 'edit':
        this.openModal(event.row);
        break;
      case 'delete':
        this.deleteItem(event.row);
        break;
    }
  }

  openModal(item: OrderDetailListItem | null): void {
    this.editingItem.set(item);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingItem.set(null);
    this.loadItems();
  }

  deleteItem(item: OrderDetailListItem): void {
    if (!confirm(`Delete ${item.productName} from this order?`)) {
      return;
    }

    this.orderDetailService.deleteOrderDetail(item.orderId, item.productId).subscribe({
      next: () => {
        this.toast.success('Item deleted successfully.');
        this.loadItems();
      },
      error: (error) => {
        this.toast.error('Failed to delete item.');
        console.error('Error deleting item:', error);
      },
    });
  }

  addItem(): void {
    this.openModal(null);
  }

  orderIdNumber(): number {
    return parseInt(this.id()!, 10);
  }

  onBack(): void {
    this.router.navigate(['/orders']);
  }
}