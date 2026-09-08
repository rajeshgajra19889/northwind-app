import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../customer.service';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { Customer } from '../customer';

@Component({
  imports: [DataGrid],
  selector: 'app-customer-list',
  styleUrl: './customer-list.scss',
  templateUrl: './customer-list.html',
})
export class CustomerList implements OnInit {
  private customerService = inject(CustomerService);
  private readonly router = inject(Router);

  columns: DataGridColumn[] = [
    { key: 'customerId', header: 'Customer ID', sortable: false, type: 'text' },
    { key: 'companyName', header: 'Company Name', sortable: true, type: 'text' },
    { key: 'contactName', header: 'Contact Name', sortable: true, type: 'text' },
    { key: 'city', header: 'City', sortable: true, type: 'text' },
    { key: 'country', header: 'Country', sortable: true, type: 'text' }
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
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
      case 'edit':
        this.router.navigate(['/hr/departments/edit', event.row.customer_id]);
        break;
      case 'delete':
        //this.deleteDepartment(event.row);
        break;
    }
  }

}   
