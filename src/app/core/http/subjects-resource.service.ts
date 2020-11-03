import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RecordsMap } from '../models/models';

@Injectable()
export class SubjectsResourceService {

  readonly ROOT = `${environment.managerUrl}/subjects`;

  constructor(private http: HttpClient) {
  }

  listSubjects(name: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.ROOT}`, {params: {name: name}});
  }

  listCustomerRecords(subject: string): Observable<RecordsMap> {
    return this.http.get<RecordsMap>(`${this.ROOT}/${subject}/records`);
  }

}
