import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class CustomerService {
    private apiUrl = 'http://localhost:3000/customers';
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
}
