import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductForm } from './product-form';
import { ProductService } from '../product-service';
import { ToastService } from '../../../shared/toast.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: { getCategories: () => of([]), getSuppliers: () => of([]), getProductById: () => of({}), createProduct: () => of({}), updateProduct: () => of({}) } },
        { provide: ToastService, useValue: { success: () => {}, error: () => {}, warning: () => {}, info: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
