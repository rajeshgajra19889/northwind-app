import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class DashboardService {
  private apiUrl = 'http://localhost:3000/dashboard';
  private readonly httpClient = inject(HttpClient);

  getOverview(): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl);
  }
}