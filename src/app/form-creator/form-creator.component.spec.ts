import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreatorComponent } from './form-creator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ModelsResourceService } from '../models-resource.service';
import { EMPTY } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { ConsentsResourceService } from '../consents-resource.service';

describe('FormCreatorComponent', () => {
  let component: FormCreatorComponent;
  let fixture: ComponentFixture<FormCreatorComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;

  beforeEach(async(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['generateToken']);

    TestBed.configureTestingModule({
      declarations: [ FormCreatorComponent ],
      imports: [ FormsModule, ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot() ],
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

    fixture = TestBed.createComponent(FormCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
