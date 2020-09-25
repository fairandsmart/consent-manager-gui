import { Injectable } from '@angular/core';
import { CollectionPage, OperatorRecordDto, Record, RecordFilter, UserRecord, UserRecordFilter } from './models';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecordsResourceService {

  constructor(private http: HttpClient) { }

  listRecords(filter: RecordFilter): Observable<CollectionPage<Record>> {
    const safeFilter: RecordFilter = {};
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        safeFilter[key] = filter[key];
      }
    }
    safeFilter.query = encodeURIComponent(safeFilter.query);
    return this.http.get<CollectionPage<Record>>(`${environment.managerUrl}/records`, {params: safeFilter as any});
  }

  listUserRecords(filter: UserRecordFilter): Observable<CollectionPage<UserRecord>> {
    const safeFilter: UserRecordFilter = {};
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        safeFilter[key] = filter[key];
      }
    }
    safeFilter.user = encodeURIComponent(safeFilter.user);
    return this.http.get<CollectionPage<UserRecord>>(`${environment.managerUrl}/records/user`, {params: safeFilter as any});
  }

  createOperatorRecords(dto: OperatorRecordDto): Observable<string> {
    return this.http.post(`${environment.managerUrl}/records/user`, dto, {responseType: 'text'});
  }

  getStats(): Observable<object[]> {
    return this.http.get<object[]>(`${environment.managerUrl}/records/subjects`); // TODO
  }

  listSubjects(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.managerUrl}/records/subjects`);
  }

}
