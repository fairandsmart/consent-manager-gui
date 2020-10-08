import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConditionsComponent } from './conditions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EntryInfoComponent } from '../entry-info/entry-info.component';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('ConditionsComponent', () => {
  let component: ConditionsComponent;
  let fixture: ComponentFixture<ConditionsComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['generateToken']);

    TestBed.configureTestingModule({
      declarations: [ ConditionsComponent, EntryInfoComponent, EntryPreviewComponent ],
      imports: [ CoreTestingModule, ReactiveFormsModule, CodemirrorModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
