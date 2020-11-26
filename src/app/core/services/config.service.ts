import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SystemResourceService } from '../http/system-resource.service';
import { ClientConfigDto } from '../models/models';
import { map } from 'rxjs/operators';

@Injectable()
export class ConfigService implements CanLoad {

  public config: ClientConfigDto;

  constructor(private systemResource: SystemResourceService) {
    console.log("new configservice built");
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.config == null) {
      return this.systemResource.getClientConfig().pipe(
        map(config => {
          console.log("config loaded: ", config);
          this.config = config;
          return config.userPageEnabled;
        })
      )
    } else {
      return this.config.userPageEnabled;
    }
  }

}
