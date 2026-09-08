import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface DataGridColumn {
  key: string;
  header: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'boolean';
}

export interface DataGridAction {
  label: string;
  action: string;
  cssClass?: string;
}

@Component({
  selector: 'app-data-grid',
  imports: [],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
})
export class DataGrid {
  @Input() columns: DataGridColumn[] = [];
  @Input() rows: any[] = [];
  @Input() loading = false;
  @Input() showSearch = true;
  @Input() rowKey = 'id';
  @Input() emptyMessage = 'No records found.';
  @Input() actions: DataGridAction[] = [];
  @Input() sortColumn = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Input() currentPage = 1;
  @Input() totalPages = 0;
  @Input() searchText = '';
  @Input() searchPlaceholder = 'Search...';

  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onSort(column: string): void {
    const direction: 'asc' | 'desc' =
      this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.sortChange.emit({ column, direction });
  }

  formatValue(row: any, column: DataGridColumn): string {
    const value = row[column.key];

    if (value === null || value === undefined) {
      return '';
    }

    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  }
}