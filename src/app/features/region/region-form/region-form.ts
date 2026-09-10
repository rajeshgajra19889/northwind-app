import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegionService } from '../region-service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-region-form',
  styleUrl: './region-form.scss',
  templateUrl: './region-form.html',
})
export class RegionForm {
  private fb = inject(NonNullableFormBuilder);
  private regionService = inject(RegionService);
  private router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  isEdit = computed(() => !!this.id());

  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');

  form = this.fb.group({
    regionDescription: ['', [Validators.required, Validators.maxLength(60)]],
  });

  private formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  isInvalid = computed(() => this.formStatus() === 'INVALID');
  isPending = computed(() => this.formStatus() === 'PENDING');
  isFormDisabled = computed(() => this.loading() || this.saving());

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadRegion(currentId);
      } else {
        this.form.reset();
      }
    });
  }

  private loadRegion(id: string): void {
    this.loading.set(true);
    this.regionService.getRegionById(id).subscribe({
      next: (region) => {
        this.form.patchValue({
          regionDescription: region.regionDescription ?? '',
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load region details.');
        this.errorMessage.set('Failed to load region details.');
        console.error('Error loading region:', error);
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

    const formValues = Object.fromEntries(
      Object.entries(this.form.value).map(([key, value]) => [key, value === '' ? null : value]),
    );
    const currentId = this.id();

    const request$ = currentId
      ? this.regionService.updateRegion(currentId, formValues)
      : this.regionService.createRegion(formValues);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(
          currentId ? 'Region updated successfully.' : 'Region created successfully.',
        );
        this.router.navigate(['/regions']);
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to save region.');
        this.errorMessage.set('Failed to save region.');
        console.error('Error saving region:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/regions']);
  }
}