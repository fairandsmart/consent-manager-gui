/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 *
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 *
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
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
