import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;
  private readonly httpClient = inject(HttpClient);

  getOverview(): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl);
  }
}