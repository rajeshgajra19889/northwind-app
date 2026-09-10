import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class CustomerService {
    private apiUrl = `${environment.apiUrl}/customers`;
    private readonly httpClient = inject(HttpClient);

    getCustomers(search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number): Observable<any> {
        let params = new HttpParams()
            .set('search', search)
            .set('sortBy', sortBy)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        return this.httpClient.get<any[]>(this.apiUrl, { params });
    }

    getCustomerById(id: string): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/${id}`);
    }

    createCustomer(customer: any): Observable<any> {
        return this.httpClient.post<any>(this.apiUrl, customer);
    }

    updateCustomer(id: string, customer: any): Observable<any> {
        return this.httpClient.patch<any>(`${this.apiUrl}/${id}`, customer);
    }

    deleteCustomer(id: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
    }
}
