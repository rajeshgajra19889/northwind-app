import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../category-service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-category-form',
  styleUrl: './category-form.scss',
  templateUrl: './category-form.html',
})
export class CategoryForm {
  private fb = inject(NonNullableFormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private readonly toast = inject(ToastService);

  id = input<string>();

  isEdit = computed(() => !!this.id());

  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  errorMessage = signal<string>('');

  form = this.fb.group({
    categoryName: ['', [Validators.required, Validators.maxLength(15)]],
    description: ['', [Validators.maxLength(500)]],
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
        this.loadCategory(currentId);
      } else {
        this.form.reset();
      }
    });
  }

  private loadCategory(id: string): void {
    this.loading.set(true);
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.form.patchValue({
          categoryName: category.categoryName ?? '',
          description: category.description ?? '',
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.toast.error('Failed to load category details.');
        this.errorMessage.set('Failed to load category details.');
        console.error('Error loading category:', error);
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
      ? this.categoryService.updateCategory(currentId, formValues)
      : this.categoryService.createCategory(formValues);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(
          currentId ? 'Category updated successfully.' : 'Category created successfully.',
        );
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to save category.');
        this.errorMessage.set('Failed to save category.');
        console.error('Error saving category:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }
}