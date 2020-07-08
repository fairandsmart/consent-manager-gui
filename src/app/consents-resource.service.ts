import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ConsentContext, CollectionPage, Record, RecordFilter, UserRecord, OperatorRecordDto, UserRecordFilter } from './models';

@Injectable({
  providedIn: 'root'
})
export class ConsentsResourceService {

  constructor(private http: HttpClient) { }

  generateToken(ctx: ConsentContext): Observable<string> {
    return this.http.post<string>(`${environment.managerUrl}/consents/token`, ctx, {responseType: 'text' as 'json'});
  }

  getForm(token: string): Observable<string> {
    return this.http.get<string>(`${environment.managerUrl}/consents`, {params: {t: token}, responseType: 'text' as 'json'});
  }

  getFormUrl(token: string): string {
    return `${environment.managerUrl}/consents?t=` + token;
  }

  getPreviewForm(): Observable<string> {
    return this.http.get<string>(`${environment.managerUrl}/consents/preview`, {responseType: 'text' as 'json'});
  }

  listRecords(filter: RecordFilter): Observable<CollectionPage<Record>> {
    const safeFilter: RecordFilter = {};
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        safeFilter[key] = filter[key];
      }
    }
    safeFilter.query = encodeURIComponent(safeFilter.query);
    return this.http.get<CollectionPage<Record>>(`${environment.managerUrl}/consents/records`, {params: safeFilter as any});
  }

  listUserRecords(filter: UserRecordFilter): Observable<CollectionPage<UserRecord>> {
    const safeFilter: UserRecordFilter = {};
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        safeFilter[key] = filter[key];
      }
    }
    safeFilter.user = encodeURIComponent(safeFilter.user);
    return this.http.get<CollectionPage<UserRecord>>(`${environment.managerUrl}/consents/records/user`, {params: safeFilter as any});
  }

  createOperatorRecords(dto: OperatorRecordDto): Observable<string> {
    return this.http.post<string>(`${environment.managerUrl}/consents/records/user`, dto, {responseType: 'text' as 'json'});
  }
}
