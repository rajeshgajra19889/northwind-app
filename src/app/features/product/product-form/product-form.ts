import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../product-service';
import { Router } from '@angular/router';
import { Category, Supplier } from '../product';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-product-form',
  styleUrl: './product-form.scss',
  templateUrl: './product-form.html',
})
export class ProductForm {
  //private fb = inject(FormBuilder);
  private fb = inject(NonNullableFormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private readonly toast = inject(ToastService);

  /**
   * Auto-incremented Product ID passed from route parameter (e.g. /products/7)
   * Handled automatically via `withComponentInputBinding()`
   */
  id = input<string>();

  // Derived state: Edit mode is active when route ID is present
  isEdit = computed(() => !!this.id());

  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Dropdown reference signals
  categories = signal<Category[]>([]);
  suppliers = signal<Supplier[]>([]);

  // Northwind Product Reactive Form Schema
  form = this.fb.group({
    productName: ['', [Validators.required, Validators.maxLength(40)]],
    supplierId: [<number | null>null],
    categoryId: [<number | null>null],
    quantityPerUnit: ['', Validators.maxLength(20)],
    unitPrice: [<number | null>0, [Validators.min(0)]],
    unitsInStock: [<number | null>0, [Validators.min(0)]],
    unitsOnOrder: [<number | null>0, [Validators.min(0)]],
    reorderLevel: [<number | null>0, [Validators.min(0)]],
    discontinued: [0],
  });

  private formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  isInvalid = computed(() => this.formStatus() === 'INVALID');
  isPending = computed(() => this.formStatus() === 'PENDING');
  isFormDisabled = computed(() => this.loading() || this.saving());

  constructor() {
    // Initial lookup data load
    this.loadLookupData();

    // Automatically reacts when the route ID input changes
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadProduct(currentId);
      } else {
        this.form.reset({
          discontinued: 0,
          unitPrice: 0,
          unitsInStock: 0,
          unitsOnOrder: 0,
          reorderLevel: 0,
        });
      }
    });
  }

  private loadLookupData(): void {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => {
        this.toast.error('Failed to load categories.');
        console.error('Failed to load categories', err);
      },
    });

    this.productService.getSuppliers().subscribe({
      next: (data) => this.suppliers.set(data),
      error: (err) => {
        this.toast.error('Failed to load suppliers.');
        console.error('Failed to load suppliers', err);
      },
    });
  }

  private loadProduct(id: string): void {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.form.patchValue(product);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load product details.');
        this.errorMessage.set('Failed to load product details.');
        console.error('Error loading product:', error);
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

    const formValues = this.form.value;
    const currentId = this.id();

    // Edit Mode: Updates existing product ID
    // Create Mode: Database assigns auto-incremented ProductID on POST
    const request$ = currentId
      ? this.productService.updateProduct(currentId, formValues)
      : this.productService.createProduct(formValues);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(currentId ? 'Product updated successfully.' : 'Product created successfully.');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to save product.');
        this.errorMessage.set('Failed to save product.');
        console.error('Error saving product:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
