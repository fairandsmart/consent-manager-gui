import { Injectable } from '@angular/core';
import { CollectionPage, RecordDto, RecordFilter } from '../models/models';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RecordsResourceService {

  readonly ROOT = `${environment.managerUrl}/records`;

  constructor(private http: HttpClient) {
  }

  listRecords(filter: RecordFilter): Observable<CollectionPage<RecordDto>> {
    const safeFilter: RecordFilter = {};
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        safeFilter[key] = filter[key];
      }
    }
    safeFilter.subject = encodeURIComponent(safeFilter.subject);
    return this.http.get<CollectionPage<RecordDto>>(`${this.ROOT}`, {params: safeFilter as any});
  }

  getStats(): Observable<object[]> {
    return of([{todo: 'TODO'}]); // TODO :)
  }

}
