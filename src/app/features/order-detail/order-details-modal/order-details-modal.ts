import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { OrderDetailService } from '../order-detail-service';
import { ProductService } from '../../product/product-service';
import { Product } from '../../product/product';
import { OrderDetailListItem, OrderDetail } from '../order-detail';
import { ToastService } from '../../../shared/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-order-details-modal',
  styleUrl: './order-details-modal.scss',
  templateUrl: './order-details-modal.html',
})
export class OrderDetailsModal {
  private fb = inject(NonNullableFormBuilder);
  private orderDetailService = inject(OrderDetailService);
  private productService = inject(ProductService);
  private readonly toast = inject(ToastService);

  orderId = input.required<number>();
  editItem = input<OrderDetailListItem | null>(null);
  close = output();

  products = signal<Product[]>([]);
  saving = signal<boolean>(false);
  editingProductId = signal<number | null>(null);

  form = this.fb.group({
    productId: [<number | null>null, Validators.required],
    unitPrice: [<number | null>0, [Validators.min(0)]],
    quantity: [<number | null>1, [Validators.required, Validators.min(1)]],
    discount: [<number | null>0, [Validators.min(0)]],
  });

  isEditMode = computed(() => this.editingProductId() !== null);

  constructor() {
    effect(() => {
      const oid = this.orderId();
      if (oid !== undefined && oid !== null) {
        this.loadProducts();
      }
    });

    effect(() => {
      const item = this.editItem();
      if (item) {
        this.editingProductId.set(item.productId);
        this.form.patchValue({
          productId: item.productId,
          unitPrice: item.unitPrice ?? 0,
          quantity: item.quantity ?? 1,
          discount: item.discount ?? 0,
        });
      }
    });
  }

  private loadProducts(): void {
    this.productService.getProducts('', 'productName', 'asc', 1, 1000).subscribe({
      next: (res) => this.products.set(res.data),
      error: (err) => console.error('Failed to load products', err),
    });
  }

  onSave(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.saving.set(true);

    const values: Partial<OrderDetail> = {
      unitPrice: this.form.controls.unitPrice.value ?? undefined,
      quantity: this.form.controls.quantity.value ?? undefined,
      discount: this.form.controls.discount.value ?? undefined,
    };

    if (!this.isEditMode()) {
      values.orderId = this.orderId();
      values.productId = this.form.controls.productId.value ?? undefined;
    }

    const request$ = this.isEditMode()
      ? this.orderDetailService.updateOrderDetail(
          this.orderId(),
          this.form.controls.productId.value!,
          values,
        )
      : this.orderDetailService.createOrderDetail(values);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(this.isEditMode() ? 'Item updated successfully.' : 'Item added successfully.');
        this.close.emit();
      },
      error: (error) => {
        this.saving.set(false);
        this.toast.error('Failed to save item.');
        console.error('Error saving item:', error);
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }
}