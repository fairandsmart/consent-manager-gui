import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatsBag } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class StatisticsResourceService {

  readonly ROOT = `${environment.managerUrl}/stats`;

  constructor(private http: HttpClient) {
  }

  getStats(): Observable<StatsBag> {
    return this.http.get<StatsBag>(`${this.ROOT}`);
  }

}
