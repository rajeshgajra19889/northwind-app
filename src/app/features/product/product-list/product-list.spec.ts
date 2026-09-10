import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { ProductService } from '../product-service';
import { ToastService } from '../../../shared/toast.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: { getProducts: () => of({ data: [], totalPages: 0 }), deleteProduct: () => of({}) } },
        { provide: ToastService, useValue: { success: () => {}, error: () => {}, warning: () => {}, info: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
