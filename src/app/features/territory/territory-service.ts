import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Territory } from './territory';

@Service()
export class TerritoryService {
  private apiUrl = 'http://localhost:3000/territories';
  private readonly httpClient = inject(HttpClient);

  getTerritories(
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

  getTerritoryById(id: string): Observable<Territory> {
    return this.httpClient.get<Territory>(`${this.apiUrl}/${id}`);
  }

  createTerritory(territory: Partial<Territory>): Observable<Territory> {
    return this.httpClient.post<Territory>(this.apiUrl, territory);
  }

  updateTerritory(id: string, territory: Partial<Territory>): Observable<Territory> {
    return this.httpClient.patch<Territory>(`${this.apiUrl}/${id}`, territory);
  }

  deleteTerritory(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }
}