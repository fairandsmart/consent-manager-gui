import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OperatorPreferencesComponent } from './operator-preferences.component';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { EMPTY } from 'rxjs';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { ConfigServiceStubSpec } from '../../../../../testing/config-service-stub.spec';
import { ConfigService } from '../../../../../core/services/config.service';

describe('OperatorPreferencesComponent', () => {
  let component: OperatorPreferencesComponent;
  let fixture: ComponentFixture<OperatorPreferencesComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;
  let configServiceStub: ConfigServiceStubSpec;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries', 'getActiveVersion']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listCustomerRecords']);
    configServiceStub = new ConfigServiceStubSpec();

    TestBed.configureTestingModule({
      declarations: [ OperatorPreferencesComponent ],
      imports: [ CoreTestingModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy},
        {provide: ConfigService, useValue: configServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelsResourceServiceSpy.listEntries.and.returnValue(EMPTY);
    modelsResourceServiceSpy.getActiveVersion.and.returnValue(EMPTY);
    subjectsResourceServiceSpy.listCustomerRecords.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(OperatorPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
