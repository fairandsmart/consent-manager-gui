import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CollectFormCreatorPageComponent } from './collect-form-creator-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { EMPTY } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('CollectFormCreatorPageComponent', () => {
  let component: CollectFormCreatorPageComponent;
  let fixture: ComponentFixture<CollectFormCreatorPageComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['generateToken']);

    TestBed.configureTestingModule({
      declarations: [ CollectFormCreatorPageComponent ],
      imports: [ CoreTestingModule, FormsModule, ReactiveFormsModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy},
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelsResourceServiceSpy.listEntries.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(CollectFormCreatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
