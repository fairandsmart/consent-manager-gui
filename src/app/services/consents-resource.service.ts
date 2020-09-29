import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConsentContext } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConsentsResourceService {

  readonly ROOT = `${environment.managerUrl}/consents`;

  constructor(private http: HttpClient) { }

  generateToken(ctx: ConsentContext): Observable<string> {
    return this.http.post(`${this.ROOT}/token`, ctx, {responseType: 'text'});
  }

  getFormUrl(token: string): string {
    return `${this.ROOT}?t=` + encodeURIComponent(token);
  }

}
