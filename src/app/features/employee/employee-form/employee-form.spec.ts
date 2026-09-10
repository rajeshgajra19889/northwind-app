import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeForm } from './employee-form';
import { EmployeeService } from '../employee-service';
import { ToastService } from '../../../shared/toast.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('EmployeeForm', () => {
  let component: EmployeeForm;
  let fixture: ComponentFixture<EmployeeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeForm],
      providers: [
        provideRouter([]),
        {
          provide: EmployeeService,
          useValue: {
            getEmployeeById: () => of({}),
            createEmployee: () => of({}),
            updateEmployee: () => of({}),
          },
        },
        {
          provide: ToastService,
          useValue: { success: () => {}, error: () => {}, warning: () => {}, info: () => {} },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
