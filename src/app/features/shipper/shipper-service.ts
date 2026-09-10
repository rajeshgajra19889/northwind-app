import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Shipper } from './shipper';
import { environment } from '../../../environments/environment';

@Service()
export class ShipperService {
  private apiUrl = `${environment.apiUrl}/shippers`;
  private readonly httpClient = inject(HttpClient);

  getShippers(
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

  getShipperById(id: string): Observable<Shipper> {
    return this.httpClient.get<Shipper>(`${this.apiUrl}/${id}`);
  }

  createShipper(shipper: Partial<Shipper>): Observable<Shipper> {
    return this.httpClient.post<Shipper>(this.apiUrl, shipper);
  }

  updateShipper(id: string, shipper: Partial<Shipper>): Observable<Shipper> {
    return this.httpClient.patch<Shipper>(`${this.apiUrl}/${id}`, shipper);
  }

  deleteShipper(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }
}