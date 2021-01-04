import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientConfigDto, SupportInfoDto, UserDto } from '../models/models';

@Injectable()
export class SystemResourceService {

  readonly ROOT = `${environment.managerUrl}/system`;

  constructor(private http: HttpClient) {
  }

  getConnectedUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.ROOT}/users/me`);
  }

  getSupportInfo(): Observable<SupportInfoDto> {
    return this.http.get<SupportInfoDto>(`${this.ROOT}/support/infos`);
  }

  getClientConfig(): Observable<ClientConfigDto> {
    return this.http.get<ClientConfigDto>(`${this.ROOT}/config`);
  }

}
