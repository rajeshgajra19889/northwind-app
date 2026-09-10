import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Product, Supplier } from './product';
import { environment } from '../../../environments/environment';

@Service()
export class ProductService {

    private apiUrl = `${environment.apiUrl}/products`;
    private readonly httpClient = inject(HttpClient);

    getProducts(search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number,
        supplierId?: number): Observable<any> {
        let params = new HttpParams()
            .set('search', search)
            .set('sortBy', sortBy)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (supplierId) {
            params = params.set('supplierId', supplierId.toString());
        }
        return this.httpClient.get<any[]>(this.apiUrl, { params });
    }

    getProductById(id: string): Observable<Product> {
        return this.httpClient.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: Partial<Product>): Observable<Product> {
        return this.httpClient.post<Product>(this.apiUrl, product);
    }

    updateProduct(id: string, product: Partial<Product>): Observable<Product> {
        return this.httpClient.patch<Product>(`${this.apiUrl}/${id}`, product);
    }
    deleteProduct(id: number): Observable<any> {
        return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
    }

    getCategories(): Observable<Category[]> {
        return this.httpClient.get<Category[]>(`${environment.apiUrl}/categories`);
    }

    getSuppliers(): Observable<Supplier[]> {
        return this.httpClient.get<Supplier[]>(`${environment.apiUrl}/suppliers`);
    }
}
