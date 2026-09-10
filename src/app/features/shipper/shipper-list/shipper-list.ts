import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { ShipperService } from '../shipper-service';
import { Shipper } from '../shipper';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-shipper-list',
  styleUrl: './shipper-list.scss',
  templateUrl: './shipper-list.html',
})
export class ShipperList implements OnInit {
  private shipperService = inject(ShipperService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  columns: DataGridColumn[] = [
    { key: 'shipperId', header: 'Shipper ID', sortable: true, type: 'number' },
    { key: 'companyName', header: 'Company Name', sortable: true, type: 'text' },
    { key: 'phone', header: 'Phone', sortable: true, type: 'text' },
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
      { label: 'Edit', action: 'edit', cssClass: 'edit-button' },
      { label: 'Delete', action: 'delete', cssClass: 'delete-button' },
    ];
  });

  shippers = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('companyName');
  sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.loadShippers();
  }

  loadShippers(): void {
    this.shipperService
      .getShippers(
        this.searchText(),
        this.sortColumn(),
        this.sortDirection(),
        this.currentPage(),
        this.pageSize(),
      )
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.shippers.set(res.data);
          this.totalPages.set(res.totalPages);
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error('Failed to load shippers.');
          console.error('Error loading shippers:', error);
        },
      });
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadShippers();
  }

  onSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
    this.loadShippers();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadShippers();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadShippers();
    }
  }

  onGridAction(event: { action: string; row: Shipper }): void {
    switch (event.action) {
      case 'edit':
        this.router.navigate(['/shippers/edit', event.row.shipperId]);
        break;
      case 'delete':
        this.deleteShipper(event.row.shipperId!);
        break;
    }
  }

  deleteShipper(shipperId: number): void {
    if (!confirm(`Delete shipper ${shipperId}?`)) {
      return;
    }

    this.shipperService.deleteShipper(shipperId).subscribe({
      next: () => {
        this.toast.success('Shipper deleted successfully.');
        this.loadShippers();
      },
      error: (error) => {
        this.toast.error('Failed to delete shipper. It may be referenced by orders.');
        console.error('Error deleting shipper:', error);
      },
    });
  }

  onAddShipper(): void {
    this.router.navigate(['/shippers/new']);
  }
}