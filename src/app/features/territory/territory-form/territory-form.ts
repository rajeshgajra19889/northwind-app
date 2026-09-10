import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TerritoryService } from '../territory-service';
import { RegionService } from '../../region/region-service';
import { Region } from '../../region/region';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-territory-form',
  styleUrl: './territory-form.scss',
  templateUrl: './territory-form.html',
})
export class TerritoryForm {
  private fb = inject(NonNullableFormBuilder);
  private territoryService = inject(TerritoryService);
  private regionService = inject(RegionService);
  private router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  isEdit = computed(() => !!this.id());

  regions = signal<Region[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');

  form = this.fb.group({
    territoryId: ['', [Validators.required, Validators.maxLength(20)]],
    territoryDescription: ['', [Validators.required, Validators.maxLength(60)]],
    regionId: [<number | null>null, Validators.required],
  });

  private formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  isInvalid = computed(() => this.formStatus() === 'INVALID');
  isPending = computed(() => this.formStatus() === 'PENDING');
  isFormDisabled = computed(() => this.loading() || this.saving());

  constructor() {
    this.loadRegions();

    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.form.controls.territoryId.disable();
        this.loadTerritory(currentId);
      } else {
        this.form.controls.territoryId.enable();
        this.form.reset();
      }
    });
  }

  private loadRegions(): void {
    this.regionService.getAllRegions().subscribe({
      next: (regions) => this.regions.set(regions),
      error: (error) => {
        this.toast.error('Failed to load regions.');
        console.error('Error loading regions:', error);
      },
    });
  }

  private loadTerritory(id: string): void {
    this.loading.set(true);
    this.territoryService.getTerritoryById(id).subscribe({
      next: (territory) => {
        this.form.patchValue({
          territoryId: territory.territoryId ?? '',
          territoryDescription: territory.territoryDescription ?? '',
          regionId: territory.regionId ?? null,
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load territory details.');
        this.errorMessage.set('Failed to load territory details.');
        console.error('Error loading territory:', error);
      },
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.isInvalid()) {
      this.errorMessage.set('Please fix the validation errors before submitting.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const formValues = this.form.getRawValue();
    const currentId = this.id();

    const request$ = currentId
      ? this.territoryService.updateTerritory(currentId, formValues)
      : this.territoryService.createTerritory(formValues);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(
          currentId ? 'Territory updated successfully.' : 'Territory created successfully.',
        );
        this.router.navigate(['/territories']);
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to save territory.');
        this.errorMessage.set('Failed to save territory.');
        console.error('Error saving territory:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/territories']);
  }
}