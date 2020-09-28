import { Injectable } from '@angular/core';
import { CollectionPage, Record, RecordFilter } from './models';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecordsResourceService {

  constructor(private http: HttpClient) {
  }

  listRecords(filter: RecordFilter): Observable<CollectionPage<Record>> {
    const safeFilter: RecordFilter = {};
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        safeFilter[key] = filter[key];
      }
    }
    safeFilter.subject = encodeURIComponent(safeFilter.subject);
    return this.http.get<CollectionPage<Record>>(`${environment.managerUrl}/records`, {params: safeFilter as any});
  }

  findSubjects(name: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.managerUrl}/records/subjects`, {params: {name: name}});
  }

  getStats(): Observable<object[]> {
    return this.http.get<object[]>(`${environment.managerUrl}/records/subjects`); // TODO
  }

}
