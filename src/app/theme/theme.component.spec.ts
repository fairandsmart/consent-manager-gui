import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeComponent } from './theme.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModelsResourceService } from '../models-resource.service';
import { ConsentsResourceService } from '../consents-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { TranslateModule } from '@ngx-translate/core';
import {of} from "rxjs";

describe('ThemeComponent', () => {
  let component: ThemeComponent;
  let fixture: ComponentFixture<ThemeComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;

  beforeEach(async(() => {
    modelsResourceServiceSpy =  createSpyObj('ModelsResourceService', ['listEntries']);
    consentsResourceServiceSpy =  createSpyObj('ConsentsResourceService', ['getPreviewForm']);

    TestBed.configureTestingModule({
      declarations: [ ThemeComponent ],
      imports: [ ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot() ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    consentsResourceServiceSpy.getPreviewForm.and.returnValue(of("<html><div>ok</div></html>"));

    fixture = TestBed.createComponent(ThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
