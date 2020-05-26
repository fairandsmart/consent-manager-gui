import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  ConsentContext,
  CollectionPage,
  Record,
  RecordFilter
} from './models';

@Injectable({
  providedIn: 'root'
})
export class ConsentsResourceService {

  constructor(private http: HttpClient) { }

  generateToken(ctx: ConsentContext): Observable<string> {
    return this.http.post<string>(`${environment.managerUrl}/consents/token`, ctx);
  }

  listRecords(filter: RecordFilter): Observable<CollectionPage<Record>> {
    return this.http.get<CollectionPage<Record>>(`${environment.managerUrl}/consents/records`, {params: {query: filter.query}});
  }
}
