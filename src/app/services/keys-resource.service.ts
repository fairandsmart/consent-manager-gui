import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Key } from '../models';

@Injectable({
  providedIn: 'root'
})
export class KeysResourceService {

  constructor(private http: HttpClient) {
  }

  listKeys(): Observable<Key[]> {
    return this.http.get<Key[]>(`${environment.managerUrl}/keys`);
  }

  createKey(name: string): Observable<Key> {
    return this.http.post<Key>(`${environment.managerUrl}/keys`, {name: name});
  }

  deleteKey(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.managerUrl}/keys/${id}`);
  }

}
