import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './employee';
import { environment } from '../../../environments/environment';

@Service()
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;
  private readonly httpClient = inject(HttpClient);

  getEmployees(
    search: string,
    sortBy: string,
    sortOrder: string,
    page: number,
    pageSize: number,
  ): Observable<any> {
    let params = new HttpParams()
      .set('search', search)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.httpClient.get<any[]>(this.apiUrl, { params });
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.httpClient.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.httpClient.patch<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }

  getEmployeeTerritories(id: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/${id}/territories`);
  }

  getAvailableTerritories(id: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/${id}/territories/available`);
  }

  assignTerritory(id: number, territoryId: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/${id}/territories/${territoryId}`, {});
  }

  unassignTerritory(id: number, territoryId: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}/territories/${territoryId}`);
  }
}
