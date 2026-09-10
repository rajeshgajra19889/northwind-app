import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from './supplier';

@Service()
export class SupplierService {
  private apiUrl = 'http://localhost:3000/suppliers';
  private readonly httpClient = inject(HttpClient);

  getSuppliers(
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
    return this.httpClient.get<any>(this.apiUrl, { params });
  }

  getAllSuppliers(): Observable<Supplier[]> {
    return this.httpClient.get<Supplier[]>(this.apiUrl);
  }

  getSupplierById(id: string): Observable<Supplier> {
    return this.httpClient.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.httpClient.post<Supplier>(this.apiUrl, supplier);
  }

  updateSupplier(id: string, supplier: Partial<Supplier>): Observable<Supplier> {
    return this.httpClient.patch<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }
}