import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { TerritoryService } from '../territory-service';
import { Territory } from '../territory';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-territory-list',
  styleUrl: './territory-list.scss',
  templateUrl: './territory-list.html',
})
export class TerritoryList implements OnInit {
  private territoryService = inject(TerritoryService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  columns: DataGridColumn[] = [
    { key: 'territoryId', header: 'Territory ID', sortable: true, type: 'text' },
    { key: 'territoryDescription', header: 'Description', sortable: true, type: 'text' },
    { key: 'regionName', header: 'Region', sortable: true, type: 'text' },
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
      { label: 'Edit', action: 'edit', cssClass: 'edit-button' },
      { label: 'Delete', action: 'delete', cssClass: 'delete-button' },
    ];
  });

  territories = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('territoryDescription');
  sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.loadTerritories();
  }

  loadTerritories(): void {
    this.territoryService
      .getTerritories(
        this.searchText(),
        this.sortColumn(),
        this.sortDirection(),
        this.currentPage(),
        this.pageSize(),
      )
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.territories.set(res.data);
          this.totalPages.set(res.totalPages);
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error('Failed to load territories.');
          console.error('Error loading territories:', error);
        },
      });
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadTerritories();
  }

  onSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
    this.loadTerritories();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadTerritories();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadTerritories();
    }
  }

  onGridAction(event: { action: string; row: Territory }): void {
    switch (event.action) {
      case 'edit':
        this.router.navigate(['/territories/edit', event.row.territoryId]);
        break;
      case 'delete':
        this.deleteTerritory(event.row.territoryId);
        break;
    }
  }

  deleteTerritory(territoryId: string): void {
    if (!confirm(`Delete territory ${territoryId}?`)) {
      return;
    }

    this.territoryService.deleteTerritory(territoryId).subscribe({
      next: () => {
        this.toast.success('Territory deleted successfully.');
        this.loadTerritories();
      },
      error: (error) => {
        this.toast.error('Failed to delete territory.');
        console.error('Error deleting territory:', error);
      },
    });
  }

  onAddTerritory(): void {
    this.router.navigate(['/territories/new']);
  }
}