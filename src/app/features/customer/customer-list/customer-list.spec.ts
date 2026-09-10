import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerList } from './customer-list';
import { CustomerService } from '../customer.service';
import { ToastService } from '../../../shared/toast.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('CustomerList', () => {
  let component: CustomerList;
  let fixture: ComponentFixture<CustomerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerList],
      providers: [
        provideRouter([]),
        { provide: CustomerService, useValue: { getCustomers: () => of({ data: [], total: 0 }), deleteCustomer: () => of({}) } },
        { provide: ToastService, useValue: { success: () => {}, error: () => {}, warning: () => {}, info: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
