import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGrid, DataGridAction, DataGridColumn } from '../../../shared/data-grid/data-grid';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee-service';
import { Employee } from '../employee';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [CommonModule, DataGrid],
  selector: 'app-employee-detail',
  styleUrl: './employee-detail.scss',
  templateUrl: './employee-detail.html',
})
export class EmployeeDetail {
  private employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  employee = signal<Employee | null>(null);
  territories = signal<any[]>([]);
  availableTerritories = signal<any[]>([]);
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  showAssignModal = signal<boolean>(false);
  selectedTerritoryId = signal<string | null>(null);

  columns: DataGridColumn[] = [
    { key: 'territoryId', header: 'Territory ID', sortable: true, type: 'text' },
    { key: 'territoryDescription', header: 'Description', sortable: true, type: 'text' },
    { key: 'regionName', header: 'Region', sortable: true, type: 'text' },
  ];

  actions = computed<DataGridAction[]>(() => {
    return [{ label: 'Unassign', action: 'unassign', cssClass: 'delete-button' }];
  });

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadEmployee(currentId);
        this.loadTerritories(currentId);
      }
    });
  }

  private loadEmployee(id: string): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => this.employee.set(employee),
      error: (error) => {
        this.toast.error('Failed to load employee details.');
        console.error('Error loading employee:', error);
      },
    });
  }

  loadTerritories(id: string): void {
    this.loading.set(true);
    this.employeeService.getEmployeeTerritories(id).subscribe({
      next: (territories) => {
        this.loading.set(false);
        this.territories.set(territories);
      },
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load employee territories.');
        console.error('Error loading territories:', error);
      },
    });
  }

  onGridAction(event: { action: string; row: any }): void {
    switch (event.action) {
      case 'unassign':
        this.unassignTerritory(event.row);
        break;
    }
  }

  onTerritoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedTerritoryId.set(value === '' ? null : value);
  }

  openAssignModal(): void {
    const id = parseInt(this.id()!, 10);
    this.selectedTerritoryId.set(null);
    this.employeeService.getAvailableTerritories(this.id()!).subscribe({
      next: (available) => this.availableTerritories.set(available),
      error: (error) => {
        this.toast.error('Failed to load available territories.');
        console.error('Error loading available territories:', error);
      },
    });
    this.showAssignModal.set(true);
  }

  closeAssignModal(): void {
    this.showAssignModal.set(false);
    this.selectedTerritoryId.set(null);
  }

  assignTerritory(): void {
    const territoryId = this.selectedTerritoryId();
    if (!territoryId) {
      return;
    }

    this.saving.set(true);
    this.employeeService.assignTerritory(parseInt(this.id()!, 10), territoryId).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success('Territory assigned successfully.');
        this.closeAssignModal();
        this.loadTerritories(this.id()!);
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to assign territory.');
        console.error('Error assigning territory:', error);
      },
    });
  }

  unassignTerritory(row: any): void {
    if (!confirm(`Unassign territory ${row.territoryId} from this employee?`)) {
      return;
    }

    this.employeeService.unassignTerritory(parseInt(this.id()!, 10), row.territoryId).subscribe({
      next: () => {
        this.toast.success('Territory unassigned successfully.');
        this.loadTerritories(this.id()!);
      },
      error: (error) => {
        this.toast.error('Failed to unassign territory.');
        console.error('Error unassigning territory:', error);
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/employees']);
  }
}