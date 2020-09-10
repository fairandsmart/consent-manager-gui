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
    return this.http.post(`${environment.managerUrl}/consents/token`, ctx, {responseType: 'text'});
  }

  buildSubmitConsentUrl(token: string): string {
    return `${environment.managerUrl}/consents?t=` + encodeURIComponent(token) + '&subject=';
  }

  getFormUrl(token: string): string {
    return `${environment.managerUrl}/consents?t=` + encodeURIComponent(token);
  }

}
