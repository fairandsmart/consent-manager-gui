import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { SystemResourceService } from '../http/system-resource.service';
import { EMPTY } from 'rxjs';
import { CoreTestingModule } from '../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('ConfigService', () => {
  let service: ConfigService;
  let systemResourceServiceSpy: SpyObj<SystemResourceService>;

  beforeEach(() => {
    systemResourceServiceSpy = createSpyObj<SystemResourceService>('SystemResourceService', ['getClientConfig']);
    systemResourceServiceSpy.getClientConfig.and.returnValue(EMPTY);

    TestBed.configureTestingModule({
      imports: [
        CoreTestingModule
      ],
      providers: [
        {provide: SystemResourceService, useValue: systemResourceServiceSpy}
      ]
    });

    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
