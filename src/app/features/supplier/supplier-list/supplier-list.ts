import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { SupplierService } from '../supplier-service';
import { Supplier } from '../supplier';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-supplier-list',
  styleUrl: './supplier-list.scss',
  templateUrl: './supplier-list.html',
})
export class SupplierList implements OnInit {
  private supplierService = inject(SupplierService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  columns: DataGridColumn[] = [
    { key: 'supplierId', header: 'Supplier ID', sortable: true, type: 'number' },
    { key: 'companyName', header: 'Company Name', sortable: true, type: 'text' },
    { key: 'contactName', header: 'Contact Name', sortable: true, type: 'text' },
    { key: 'city', header: 'City', sortable: true, type: 'text' },
    { key: 'country', header: 'Country', sortable: true, type: 'text' },
    { key: 'phone', header: 'Phone', sortable: true, type: 'text' },
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
      { label: 'Products', action: 'products', cssClass: 'primary-button' },
      { label: 'Edit', action: 'edit', cssClass: 'edit-button' },
      { label: 'Delete', action: 'delete', cssClass: 'delete-button' },
    ];
  });

  suppliers = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('companyName');
  sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService
      .getSuppliers(
        this.searchText(),
        this.sortColumn(),
        this.sortDirection(),
        this.currentPage(),
        this.pageSize(),
      )
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.suppliers.set(res.data);
          this.totalPages.set(res.totalPages);
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error('Failed to load suppliers.');
          console.error('Error loading suppliers:', error);
        },
      });
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadSuppliers();
  }

  onSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
    this.loadSuppliers();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadSuppliers();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadSuppliers();
    }
  }

  onGridAction(event: { action: string; row: Supplier }): void {
    switch (event.action) {
      case 'products':
        this.router.navigate(['/suppliers/details', event.row.supplierId]);
        break;
      case 'edit':
        this.router.navigate(['/suppliers/edit', event.row.supplierId]);
        break;
      case 'delete':
        this.deleteSupplier(event.row.supplierId!);
        break;
    }
  }

  deleteSupplier(supplierId: number): void {
    if (!confirm(`Delete supplier ${supplierId}?`)) {
      return;
    }

    this.supplierService.deleteSupplier(supplierId).subscribe({
      next: () => {
        this.toast.success('Supplier deleted successfully.');
        this.loadSuppliers();
      },
      error: (error) => {
        this.toast.error('Failed to delete supplier. They may have products.');
        console.error('Error deleting supplier:', error);
      },
    });
  }

  onAddSupplier(): void {
    this.router.navigate(['/suppliers/new']);
  }
}