import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../supplier-service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-supplier-form',
  styleUrl: './supplier-form.scss',
  templateUrl: './supplier-form.html',
})
export class SupplierForm {
  private fb = inject(NonNullableFormBuilder);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  isEdit = computed(() => !!this.id());

  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');

  form = this.fb.group({
    companyName: ['', [Validators.required, Validators.maxLength(40)]],
    contactName: ['', [Validators.maxLength(30)]],
    contactTitle: ['', [Validators.maxLength(30)]],
    address: ['', [Validators.maxLength(60)]],
    city: ['', [Validators.maxLength(15)]],
    region: ['', [Validators.maxLength(15)]],
    postalCode: ['', [Validators.maxLength(10)]],
    country: ['', [Validators.maxLength(15)]],
    phone: ['', [Validators.maxLength(24)]],
    fax: ['', [Validators.maxLength(24)]],
    homepage: ['', [Validators.maxLength(500)]],
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
        this.loadSupplier(currentId);
      } else {
        this.form.reset();
      }
    });
  }

  private loadSupplier(id: string): void {
    this.loading.set(true);
    this.supplierService.getSupplierById(id).subscribe({
      next: (supplier) => {
        this.form.patchValue({
          companyName: supplier.companyName ?? '',
          contactName: supplier.contactName ?? '',
          contactTitle: supplier.contactTitle ?? '',
          address: supplier.address ?? '',
          city: supplier.city ?? '',
          region: supplier.region ?? '',
          postalCode: supplier.postalCode ?? '',
          country: supplier.country ?? '',
          phone: supplier.phone ?? '',
          fax: supplier.fax ?? '',
          homepage: supplier.homepage ?? '',
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load supplier details.');
        this.errorMessage.set('Failed to load supplier details.');
        console.error('Error loading supplier:', error);
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
      ? this.supplierService.updateSupplier(currentId, formValues)
      : this.supplierService.createSupplier(formValues);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(
          currentId ? 'Supplier updated successfully.' : 'Supplier created successfully.',
        );
        this.router.navigate(['/suppliers']);
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to save supplier.');
        this.errorMessage.set('Failed to save supplier.');
        console.error('Error saving supplier:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/suppliers']);
  }
}