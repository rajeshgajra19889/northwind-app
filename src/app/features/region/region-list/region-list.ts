import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { RegionService } from '../region-service';
import { Region } from '../region';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [DataGrid],
  selector: 'app-region-list',
  styleUrl: './region-list.scss',
  templateUrl: './region-list.html',
})
export class RegionList implements OnInit {
  private regionService = inject(RegionService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  columns: DataGridColumn[] = [
    { key: 'regionId', header: 'Region ID', sortable: true, type: 'number' },
    { key: 'regionDescription', header: 'Region Description', sortable: true, type: 'text' },
  ];

  actions = computed<DataGridAction[]>(() => {
    return [
      { label: 'Edit', action: 'edit', cssClass: 'edit-button' },
      { label: 'Delete', action: 'delete', cssClass: 'delete-button' },
    ];
  });

  regions = signal<any[]>([]);
  loading = signal<boolean>(true);
  searchText = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  sortColumn = signal('regionDescription');
  sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.loadRegions();
  }

  loadRegions(): void {
    this.regionService
      .getRegions(
        this.searchText(),
        this.sortColumn(),
        this.sortDirection(),
        this.currentPage(),
        this.pageSize(),
      )
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.regions.set(res.data);
          this.totalPages.set(res.totalPages);
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error('Failed to load regions.');
          console.error('Error loading regions:', error);
        },
      });
  }

  onSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
    this.loadRegions();
  }

  onSort(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
    this.loadRegions();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadRegions();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadRegions();
    }
  }

  onGridAction(event: { action: string; row: Region }): void {
    switch (event.action) {
      case 'edit':
        this.router.navigate(['/regions/edit', event.row.regionId]);
        break;
      case 'delete':
        this.deleteRegion(event.row.regionId!);
        break;
    }
  }

  deleteRegion(regionId: number): void {
    if (!confirm(`Delete region ${regionId}?`)) {
      return;
    }

    this.regionService.deleteRegion(regionId).subscribe({
      next: () => {
        this.toast.success('Region deleted successfully.');
        this.loadRegions();
      },
      error: (error) => {
        this.toast.error('Failed to delete region. It may have territories.');
        console.error('Error deleting region:', error);
      },
    });
  }

  onAddRegion(): void {
    this.router.navigate(['/regions/new']);
  }
}