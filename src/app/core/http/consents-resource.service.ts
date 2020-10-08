import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConsentContext } from '../models/models';

@Injectable()
export class ConsentsResourceService {

  readonly ROOT = `${environment.managerUrl}/consents`;

  constructor(private http: HttpClient) {
  }

  generateToken(ctx: ConsentContext): Observable<string> {
    return this.http.post(`${this.ROOT}/token`, ctx, {responseType: 'text'});
  }

  getFormUrl(token: string): string {
    return `${this.ROOT}?t=` + encodeURIComponent(token);
  }

  postConsent(values: HttpParams): Observable<string> {
    return this.http.post(`${this.ROOT}`, values.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      }, responseType: 'text'
    });
  }

}
