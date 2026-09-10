import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetail } from './order-detail';
import { environment } from '../../../environments/environment';

@Service()
export class OrderDetailService {
  private apiUrl = `${environment.apiUrl}/order-details`;
  private readonly httpClient = inject(HttpClient);

  getOrderDetails(
    search: string,
    sortBy: string,
    sortOrder: string,
    page: number,
    pageSize: number,
    orderId?: number,
  ): Observable<any> {
    let params = new HttpParams()
      .set('search', search)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (orderId !== undefined) {
      params = params.set('orderId', orderId.toString());
    }
    return this.httpClient.get<any>(this.apiUrl, { params });
  }

  getOrderDetailById(orderId: number, productId: number): Observable<OrderDetail> {
    return this.httpClient.get<OrderDetail>(`${this.apiUrl}/${orderId}/${productId}`);
  }

  createOrderDetail(detail: Partial<OrderDetail>): Observable<OrderDetail> {
    return this.httpClient.post<OrderDetail>(this.apiUrl, detail);
  }

  updateOrderDetail(
    orderId: number,
    productId: number,
    detail: Partial<OrderDetail>,
  ): Observable<OrderDetail> {
    return this.httpClient.patch<OrderDetail>(`${this.apiUrl}/${orderId}/${productId}`, detail);
  }

  deleteOrderDetail(orderId: number, productId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${orderId}/${productId}`);
  }
}