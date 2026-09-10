import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../customer.service';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { Customer } from '../customer';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-customer-list',
  styleUrl: './customer-list.scss',
  templateUrl: './customer-list.html',
})
export class CustomerList implements OnInit {
  private customerService = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  columns: DataGridColumn[] = [
    { key: 'customerId', header: 'Customer ID', sortable: false, type: 'text' },
    { key: 'companyName', header: 'Company Name', sortable: true, type: 'text' },
    { key: 'contactName', header: 'Contact Name', sortable: true, type: 'text' },
    { key: 'city', header: 'City', sortable: true, type: 'text' },
    { key: 'country', header: 'Country', sortable: true, type: 'text' }
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
      { label: 'Orders', action: 'orders', cssClass: 'primary-button' },
      { label: 'Edit', action: 'edit', cssClass: 'edit-button' },
      { label: 'Delete', action: 'delete', cssClass: 'delete-button' },
    ];

  });

  customers = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('Name');
  sortDirection = signal<'asc' | 'desc'>('asc');



  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.customerService.getCustomers(
      this.searchText(),
      this.sortColumn(),
      this.sortDirection(),
      this.currentPage(),
      this.pageSize()).subscribe({
        next: (res) => {
          this.loading.set(false);
          this.customers.set(res.data);
          this.totalPages.set(Math.ceil(res.total / this.pageSize()));
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error('Failed to load customers.');
          console.error('Error loading customers:', error);
        }
      });
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadCustomers();
  }

  onSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
    this.loadCustomers();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadCustomers();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadCustomers();
    }
  }
  onGridAction(event: { action: string; row: Customer }): void {
    switch (event.action) {
      case 'orders':
        this.router.navigate(['/customers/orders', event.row.customerId]);
        break;
      case 'edit':
        this.router.navigate(['/customers/edit', event.row.customerId]);
        break;
      case 'delete':
        this.deleteCustomer(event.row);
        break;
    }
  }

  deleteCustomer(customer: Customer): void {
    if (!confirm(`Delete customer ${customer.companyName}?`)) {
      return;
    }

    this.customerService.deleteCustomer(customer.customerId).subscribe({
      next: () => {
        this.toast.success('Customer deleted successfully.');
        this.loadCustomers();
      },
      error: (error) => {
        this.toast.error('Failed to delete customer. They may have orders.');
        console.error('Error deleting customer:', error);
      },
    });
  }

  onAddCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

}   
