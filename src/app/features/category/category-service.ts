import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from './category';

@Service()
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';
  private readonly httpClient = inject(HttpClient);

  getCategories(
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

  getCategoryById(id: string): Observable<Category> {
    return this.httpClient.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.httpClient.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.httpClient.patch<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }
}