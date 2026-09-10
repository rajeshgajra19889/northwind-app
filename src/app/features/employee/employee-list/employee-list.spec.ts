import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeList } from './employee-list';
import { EmployeeService } from '../employee-service';
import { ToastService } from '../../../shared/toast.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('EmployeeList', () => {
  let component: EmployeeList;
  let fixture: ComponentFixture<EmployeeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeList],
      providers: [
        provideRouter([]),
        {
          provide: EmployeeService,
          useValue: {
            getEmployees: () => of({ data: [], total: 0 }),
            deleteEmployee: () => of({}),
          },
        },
        {
          provide: ToastService,
          useValue: { success: () => {}, error: () => {}, warning: () => {}, info: () => {} },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
