import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { ProductService } from '../product-service';
import { Product } from '../product';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-product-list',
  styleUrl: './product-list.scss',
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  columns: DataGridColumn[] = [
    { key: 'productId', header: 'Product ID', sortable: true, type: 'number' },
    { key: 'productName', header: 'Product Name', sortable: true, type: 'text' },
    { key: 'categoryName', header: 'Category Name', sortable: true, type: 'text' },
    { key: 'supplierName', header: 'Supplier Name', sortable: true, type: 'text' },
    { key: 'unitsInStock', header: 'Units of Stock', sortable: true, type: 'text' }
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
      { label: 'Edit', action: 'edit', cssClass: 'edit-button' },
      { label: 'Delete', action: 'delete', cssClass: 'delete-button' },
    ];

  });

  products = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('Name');
  sortDirection = signal<'asc' | 'desc'>('asc');



  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.productService.getProducts(
      this.searchText(),
      this.sortColumn(),
      this.sortDirection(),
      this.currentPage(),
      this.pageSize()).subscribe({
        next: (res) => {
          this.loading.set(false);
          this.products.set(res.data);
          this.totalPages.set(res.totalPages);
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error('Failed to load products.');
          console.error('Error loading products:', error);
        }
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
  onGridAction(event: { action: string; row: Product }): void {
    switch (event.action) {
      case 'edit':
        this.router.navigate(['/products/edit', event.row.productId]);
        break;
      case 'delete':
        this.deleteProduct(event.row.productId!);
        break;
    }
  }

  deleteProduct(productId: number): void {
    if (!confirm(`Delete product ${productId}?`)) {
      return;
    }

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.toast.success('Product deleted successfully.');
        this.loadProducts();
      },
      error: (error) => {
        this.toast.error('Failed to delete product. They may have orders.');
        console.error('Error deleting product:', error);
      },
    });
  }


  onAddProduct(): void {
    this.router.navigate(['/products/new']);
  }


}
