import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../order-service';
import { CustomerService } from '../../customer/customer.service';
import { EmployeeService } from '../../employee/employee-service';
import { Customer } from '../../customer/customer';
import { Employee } from '../../employee/employee';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-order-form',
  styleUrl: './order-form.scss',
  templateUrl: './order-form.html',
})
export class OrderForm {
  private fb = inject(NonNullableFormBuilder);
  private orderService = inject(OrderService);
  private customerService = inject(CustomerService);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  isEdit = computed(() => !!this.id());

  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');

  customers = signal<Customer[]>([]);
  employees = signal<Employee[]>([]);

  form = this.fb.group({
    customerId: [''],
    employeeId: [<number | null>null],
    orderDate: [''],
    requiredDate: [''],
    shippedDate: [''],
    freight: [<number | null>null],
    shipName: ['', Validators.maxLength(40)],
    shipAddress: ['', Validators.maxLength(60)],
    shipCity: ['', Validators.maxLength(15)],
    shipRegion: ['', Validators.maxLength(15)],
    shipPostalCode: ['', Validators.maxLength(10)],
    shipCountry: ['', Validators.maxLength(15)],
  });

  private formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  isInvalid = computed(() => this.formStatus() === 'INVALID');
  isPending = computed(() => this.formStatus() === 'PENDING');
  isFormDisabled = computed(() => this.loading() || this.saving());

  constructor() {
    this.loadLookupData();

    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadOrder(currentId);
      } else {
        this.form.reset();
      }
    });
  }

  private loadLookupData(): void {
    this.customerService
      .getCustomers('', 'companyName', 'asc', 1, 1000)
      .subscribe({
        next: (res) => this.customers.set(res.data),
        error: (err) => console.error('Failed to load customers', err),
      });

    this.employeeService
      .getEmployees('', 'lastName', 'asc', 1, 1000)
      .subscribe({
        next: (res) => this.employees.set(res.data),
        error: (err) => console.error('Failed to load employees', err),
      });
  }

  private loadOrder(id: string): void {
    this.loading.set(true);
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.form.patchValue({
          customerId: order.customerId ?? '',
          employeeId: order.employeeId ?? null,
          orderDate: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : '',
          requiredDate: order.requiredDate ? new Date(order.requiredDate).toISOString().split('T')[0] : '',
          shippedDate: order.shippedDate ? new Date(order.shippedDate).toISOString().split('T')[0] : '',
          freight: order.freight ?? null,
          shipName: order.shipName ?? '',
          shipAddress: order.shipAddress ?? '',
          shipCity: order.shipCity ?? '',
          shipRegion: order.shipRegion ?? '',
          shipPostalCode: order.shipPostalCode ?? '',
          shipCountry: order.shipCountry ?? '',
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load order details.');
        this.errorMessage.set('Failed to load order details.');
        console.error('Error loading order:', error);
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
      ? this.orderService.updateOrder(currentId, formValues)
      : this.orderService.createOrder(formValues);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(
          currentId ? 'Order updated successfully.' : 'Order created successfully.',
        );
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to save order.');
        this.errorMessage.set('Failed to save order.');
        console.error('Error saving order:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/orders']);
  }
}