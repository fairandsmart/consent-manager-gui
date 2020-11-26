import { Injectable } from '@angular/core';
import { RecordsMap } from '../models/models';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RecordsResourceService {

  readonly ROOT = `${environment.managerUrl}/records`;

  constructor(private http: HttpClient) {
  }

  listCustomerRecords(subject: string): Observable<RecordsMap> {
    return this.http.get<RecordsMap>(`${this.ROOT}`, {params: {subject: subject}});
  }

}
