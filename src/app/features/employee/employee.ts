export interface Employee {
  employeeId?: number;
  lastName: string;
  firstName: string;
  title?: string | null;
  titleOfCourtesy?: string | null;
  birthDate?: Date | null;
  hireDate?: Date | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  homePhone?: string | null;
  extension?: string | null;
  notes?: string | null;
  reportsTo?: number | null;
  photoPath?: string | null;
  reportsToEmployee?: { employeeId: number; firstName: string; lastName: string } | null;
}

export interface EmployeeListItem {
  employeeId: number;
  lastName: string;
  firstName: string;
  title: string | null;
  city: string | null;
  country: string | null;
  reportsToEmployeeLastName: string | null;
}
