import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-customer-form',
  styleUrl: './customer-form.scss',
  templateUrl: './customer-form.html',
})
export class CustomerForm {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private readonly toast = inject(ToastService);

  /**
   * Automatically bound to the route parameter ':id'.
   * Angular passes the parameter value directly to this input signal.
   */
  id = input<string>();

  // Derived state: Edit mode is true whenever an ID parameter is present
  isEdit = computed(() => !!this.id());

  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');

  form = this.fb.group({
    customerId: ['', [Validators.required, Validators.maxLength(5)]],
    companyName: ['', [Validators.required, Validators.maxLength(40)]],
    contactName: ['', Validators.maxLength(30)],
    contactTitle: ['', Validators.maxLength(30)],
    address: ['', Validators.maxLength(60)],
    city: ['', Validators.maxLength(15)],
    region: ['', Validators.maxLength(15)],
    postalCode: ['', Validators.maxLength(10)],
    country: ['', Validators.maxLength(15)],
    phone: ['', Validators.maxLength(24)],
    fax: ['', Validators.maxLength(24)],
  });

  private formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  isInvalid = computed(() => this.formStatus() === 'INVALID');
  isPending = computed(() => this.formStatus() === 'PENDING');
  isFormDisabled = computed(() => this.loading() || this.saving());

  constructor() {
    // Automatically triggers whenever the route `id` signal changes
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.form.controls.customerId.disable();
        this.loadCustomer(currentId);
      } else {
        this.form.controls.customerId.enable();
        this.form.reset();
      }
    });
  }

  loadCustomer(id: string): void {
    this.loading.set(true);
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.form.patchValue(customer);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load customer.');
        this.errorMessage.set('Failed to load customer.');
        console.error('Error loading customer:', error);
      },
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.isInvalid()) {
      this.errorMessage.set('Please fix the validation errors.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const customer = this.form.getRawValue();

    const request$ = this.isEdit()
      ? this.customerService.updateCustomer(customer.customerId!, customer)
      : this.customerService.createCustomer(customer);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(this.isEdit() ? 'Customer updated successfully.' : 'Customer created successfully.');
        this.router.navigate(['/customers']);
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to save customer.');
        this.errorMessage.set('Failed to save customer.');
        console.error('Error saving customer:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }
}