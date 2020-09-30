import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RecordDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SubjectsResourceService {

  readonly ROOT = `${environment.managerUrl}/subjects`;

  constructor(private http: HttpClient) {
  }

  listSubjects(name: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.ROOT}`, {params: {name: name}});
  }

  listCustomerRecords(subject: string): Observable<{ [key: string]: RecordDto[] }> {
    return this.http.get<{ [key: string]: RecordDto[] }>(`${this.ROOT}/${subject}/records`);
  }

}
