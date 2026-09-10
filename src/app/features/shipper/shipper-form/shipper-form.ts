import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShipperService } from '../shipper-service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-shipper-form',
  styleUrl: './shipper-form.scss',
  templateUrl: './shipper-form.html',
})
export class ShipperForm {
  private fb = inject(NonNullableFormBuilder);
  private shipperService = inject(ShipperService);
  private router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  isEdit = computed(() => !!this.id());

  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');

  form = this.fb.group({
    companyName: ['', [Validators.required, Validators.maxLength(40)]],
    phone: ['', [Validators.maxLength(24)]],
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
        this.loadShipper(currentId);
      } else {
        this.form.reset();
      }
    });
  }

  private loadShipper(id: string): void {
    this.loading.set(true);
    this.shipperService.getShipperById(id).subscribe({
      next: (shipper) => {
        this.form.patchValue({
          companyName: shipper.companyName ?? '',
          phone: shipper.phone ?? '',
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load shipper details.');
        this.errorMessage.set('Failed to load shipper details.');
        console.error('Error loading shipper:', error);
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
      ? this.shipperService.updateShipper(currentId, formValues)
      : this.shipperService.createShipper(formValues);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(
          currentId ? 'Shipper updated successfully.' : 'Shipper created successfully.',
        );
        this.router.navigate(['/shippers']);
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to save shipper.');
        this.errorMessage.set('Failed to save shipper.');
        console.error('Error saving shipper:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/shippers']);
  }
}