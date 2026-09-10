import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { DataGrid, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { SupplierService } from '../supplier-service';
import { Supplier } from '../supplier';
import { ProductService } from '../../product/product-service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-supplier-detail',
  styleUrl: './supplier-detail.scss',
  templateUrl: './supplier-detail.html',
})
export class SupplierDetail {
  private supplierService = inject(SupplierService);
  private productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  supplier = signal<Supplier | null>(null);
  products = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('productName');
  sortDirection = signal<'asc' | 'desc'>('asc');

  columns: DataGridColumn[] = [
    { key: 'productId', header: 'Product ID', sortable: true, type: 'number' },
    { key: 'productName', header: 'Product Name', sortable: true, type: 'text' },
    { key: 'categoryName', header: 'Category', sortable: true, type: 'text' },
    { key: 'quantityPerUnit', header: 'Quantity Per Unit', sortable: false, type: 'text' },
    { key: 'unitPrice', header: 'Unit Price', sortable: true, type: 'number' },
    { key: 'unitsInStock', header: 'In Stock', sortable: true, type: 'number' },
  ];

  actions = computed(() => []);

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadSupplier(currentId);
        this.loadProducts();
      }
    });
  }

  private loadSupplier(id: string): void {
    this.supplierService.getSupplierById(id).subscribe({
      next: (supplier) => this.supplier.set(supplier),
      error: (error) => {
        this.toast.error('Failed to load supplier details.');
        console.error('Error loading supplier:', error);
      },
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService
      .getProducts(
        this.searchText(),
        this.sortColumn(),
        this.sortDirection(),
        this.currentPage(),
        this.pageSize(),
        parseInt(this.id()!, 10),
      )
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.products.set(res.data);
          this.totalPages.set(res.totalPages);
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error('Failed to load products.');
          console.error('Error loading products:', error);
        },
      });
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
    this.loadProducts();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadProducts();
    }
  }

  onBack(): void {
    this.router.navigate(['/suppliers']);
  }
}