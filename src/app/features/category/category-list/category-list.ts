import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { CategoryService } from '../category-service';
import { Category } from '../category';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-category-list',
  styleUrl: './category-list.scss',
  templateUrl: './category-list.html',
})
export class CategoryList implements OnInit {
  private categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  columns: DataGridColumn[] = [
    { key: 'categoryId', header: 'Category ID', sortable: true, type: 'number' },
    { key: 'categoryName', header: 'Category Name', sortable: true, type: 'text' },
    { key: 'description', header: 'Description', sortable: true, type: 'text' },
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
      { label: 'Edit', action: 'edit', cssClass: 'edit-button' },
      { label: 'Delete', action: 'delete', cssClass: 'delete-button' },
    ];
  });

  categories = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('categoryName');
  sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService
      .getCategories(
        this.searchText(),
        this.sortColumn(),
        this.sortDirection(),
        this.currentPage(),
        this.pageSize(),
      )
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.categories.set(res.data);
          this.totalPages.set(res.totalPages);
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error('Failed to load categories.');
          console.error('Error loading categories:', error);
        },
      });
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadCategories();
  }

  onSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
    this.loadCategories();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadCategories();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadCategories();
    }
  }

  onGridAction(event: { action: string; row: Category }): void {
    switch (event.action) {
      case 'edit':
        this.router.navigate(['/categories/edit', event.row.categoryId]);
        break;
      case 'delete':
        this.deleteCategory(event.row.categoryId!);
        break;
    }
  }

  deleteCategory(categoryId: number): void {
    if (!confirm(`Delete category ${categoryId}?`)) {
      return;
    }

    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.toast.success('Category deleted successfully.');
        this.loadCategories();
      },
      error: (error) => {
        this.toast.error('Failed to delete category. They may have products.');
        console.error('Error deleting category:', error);
      },
    });
  }

  onAddCategory(): void {
    this.router.navigate(['/categories/new']);
  }
}