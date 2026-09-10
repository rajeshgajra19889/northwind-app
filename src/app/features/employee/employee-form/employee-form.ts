import { Component, computed, effect, inject, input, signal } from '@angular/core';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-employee-form',
  styleUrl: './employee-form.scss',
  templateUrl: './employee-form.html',
})
export class EmployeeForm {
  private fb = inject(NonNullableFormBuilder);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  isEdit = computed(() => !!this.id());

  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(10)]],
    lastName: ['', [Validators.required, Validators.maxLength(20)]],
    title: ['', Validators.maxLength(30)],
    titleOfCourtesy: ['', Validators.maxLength(25)],
    birthDate: [''],
    hireDate: [''],
    address: ['', Validators.maxLength(60)],
    city: ['', Validators.maxLength(15)],
    region: ['', Validators.maxLength(15)],
    postalCode: ['', Validators.maxLength(10)],
    country: ['', Validators.maxLength(15)],
    homePhone: ['', Validators.maxLength(24)],
    extension: ['', Validators.maxLength(4)],
    notes: [''],
    reportsTo: [<number | null>null],
    photoPath: ['', Validators.maxLength(255)],
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
        this.loadEmployee(currentId);
      } else {
        this.form.reset();
      }
    });
  }

  private loadEmployee(id: string): void {
    this.loading.set(true);
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.form.patchValue({
          firstName: employee.firstName ?? '',
          lastName: employee.lastName ?? '',
          title: employee.title ?? '',
          titleOfCourtesy: employee.titleOfCourtesy ?? '',
          birthDate: employee.birthDate
            ? new Date(employee.birthDate).toISOString().split('T')[0]
            : '',
          hireDate: employee.hireDate
            ? new Date(employee.hireDate).toISOString().split('T')[0]
            : '',
          address: employee.address ?? '',
          city: employee.city ?? '',
          region: employee.region ?? '',
          postalCode: employee.postalCode ?? '',
          country: employee.country ?? '',
          homePhone: employee.homePhone ?? '',
          extension: employee.extension ?? '',
          notes: employee.notes ?? '',
          reportsTo: employee.reportsToEmployee?.employeeId ?? null,
          photoPath: employee.photoPath ?? '',
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load employee details.');
        this.errorMessage.set('Failed to load employee details.');
        console.error('Error loading employee:', error);
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
      ? this.employeeService.updateEmployee(currentId, formValues)
      : this.employeeService.createEmployee(formValues);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(
          currentId ? 'Employee updated successfully.' : 'Employee created successfully.',
        );
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to save employee.');
        this.errorMessage.set('Failed to save employee.');
        console.error('Error saving employee:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}
