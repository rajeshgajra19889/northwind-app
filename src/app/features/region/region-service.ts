import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Region } from './region';

@Service()
export class RegionService {
  private apiUrl = 'http://localhost:3000/regions';
  private readonly httpClient = inject(HttpClient);

  getRegions(
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

  getAllRegions(): Observable<Region[]> {
    return this.httpClient.get<Region[]>(this.apiUrl);
  }

  getRegionById(id: string): Observable<Region> {
    return this.httpClient.get<Region>(`${this.apiUrl}/${id}`);
  }

  createRegion(region: Partial<Region>): Observable<Region> {
    return this.httpClient.post<Region>(this.apiUrl, region);
  }

  updateRegion(id: string, region: Partial<Region>): Observable<Region> {
    return this.httpClient.patch<Region>(`${this.apiUrl}/${id}`, region);
  }

  deleteRegion(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }
}