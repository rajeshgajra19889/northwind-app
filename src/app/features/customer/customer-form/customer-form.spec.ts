import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerForm } from './customer-form';
import { CustomerService } from '../customer.service';
import { ToastService } from '../../../shared/toast.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('CustomerForm', () => {
  let component: CustomerForm;
  let fixture: ComponentFixture<CustomerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerForm],
      providers: [
        provideRouter([]),
        { provide: CustomerService, useValue: { getCustomerById: () => of({}), createCustomer: () => of({}), updateCustomer: () => of({}) } },
        { provide: ToastService, useValue: { success: () => {}, error: () => {}, warning: () => {}, info: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
