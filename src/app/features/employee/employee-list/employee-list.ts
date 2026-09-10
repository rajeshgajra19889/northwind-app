import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee-service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-employee-list',
  styleUrl: './employee-list.scss',
  templateUrl: './employee-list.html',
})
export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  columns: DataGridColumn[] = [
    { key: 'employeeId', header: 'Employee ID', sortable: true, type: 'number' },
    { key: 'firstName', header: 'First Name', sortable: true, type: 'text' },
    { key: 'lastName', header: 'Last Name', sortable: true, type: 'text' },
    { key: 'title', header: 'Title', sortable: true, type: 'text' },
    { key: 'city', header: 'City', sortable: true, type: 'text' },
    { key: 'country', header: 'Country', sortable: true, type: 'text' },
    {
      key: 'reportsTo',
      header: 'Reports To',
      sortable: false,
      type: 'text',
      valueGetter: (row) => row.reportsToEmployee ? [row.reportsToEmployee.firstName, row.reportsToEmployee.lastName].filter(Boolean).join(' ') : '',
    },
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
      { label: 'Orders', action: 'orders', cssClass: 'primary-button' },
      { label: 'Territories', action: 'territories', cssClass: 'edit-button' },
      { label: 'Edit', action: 'edit', cssClass: 'edit-button' },
      { label: 'Delete', action: 'delete', cssClass: 'delete-button' },
    ];
  });

  employees = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('lastName');
  sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService
      .getEmployees(
        this.searchText(),
        this.sortColumn(),
        this.sortDirection(),
        this.currentPage(),
        this.pageSize(),
      )
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.employees.set(res.data);
          this.totalPages.set(Math.ceil(res.total / this.pageSize()));
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error('Failed to load employees.');
          console.error('Error loading employees:', error);
        },
      });
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadEmployees();
  }

  onSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
    this.loadEmployees();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadEmployees();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadEmployees();
    }
  }

  onGridAction(event: { action: string; row: any }): void {
    switch (event.action) {
      case 'orders':
        this.router.navigate(['/employees/orders', event.row.employeeId]);
        break;
      case 'territories':
        this.router.navigate(['/employees/details', event.row.employeeId]);
        break;
      case 'edit':
        this.router.navigate(['/employees/edit', event.row.employeeId]);
        break;
      case 'delete':
        this.deleteEmployee(event.row.employeeId);
        break;
    }
  }

  deleteEmployee(employeeId: number): void {
    if (!confirm(`Delete employee ${employeeId}?`)) {
      return;
    }

    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        this.toast.success('Employee deleted successfully.');
        this.loadEmployees();
      },
      error: (error) => {
        this.toast.error('Failed to delete employee. They may have orders.');
        console.error('Error deleting employee:', error);
      },
    });
  }

  onAddEmployee(): void {
    this.router.navigate(['/employees/new']);
  }
}
