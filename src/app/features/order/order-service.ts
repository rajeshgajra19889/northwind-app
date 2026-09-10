import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './order';

@Service()
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';
  private readonly httpClient = inject(HttpClient);

  getOrders(
    search: string,
    sortBy: string,
    sortOrder: string,
    page: number,
    pageSize: number,
    employeeId?: number,
    customerId?: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set('search', search)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (employeeId) {
      params = params.set('employeeId', employeeId.toString());
    }
    if (customerId) {
      params = params.set('customerId', customerId);
    }
    return this.httpClient.get<any>(this.apiUrl, { params });
  }

  getOrderById(id: string): Observable<Order> {
    return this.httpClient.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: Partial<Order>): Observable<Order> {
    return this.httpClient.post<Order>(this.apiUrl, order);
  }

  updateOrder(id: string, order: Partial<Order>): Observable<Order> {
    return this.httpClient.patch<Order>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }
}