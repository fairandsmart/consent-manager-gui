import { Injectable } from '@angular/core';
import { ExtractionConfigDto, ExtractionResultDto, RecordsMap } from '../models/models';
import { Observable } from 'rxjs';
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

  extractRecords(config: ExtractionConfigDto): Observable<ExtractionResultDto[]> {
    return this.http.post<ExtractionResultDto[]>(`${this.ROOT}/extraction`, config);
  }

  extractRecordsCsv(config: ExtractionConfigDto): Observable<string> {
    return this.http.post(`${this.ROOT}/extraction`, config, {
      headers: {
        Accept: 'text/csv'
      },
      responseType: 'text'
    });
  }

}
