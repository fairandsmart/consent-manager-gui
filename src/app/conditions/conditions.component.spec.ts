import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsComponent } from './conditions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { TranslateModule } from '@ngx-translate/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EntryInfoComponent } from '../entry-info/entry-info.component';

describe('ConditionsComponent', () => {
  let component: ConditionsComponent;
  let fixture: ComponentFixture<ConditionsComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(async(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);

    TestBed.configureTestingModule({
      declarations: [ ConditionsComponent, EntryInfoComponent ],
      imports: [ ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot(), CodemirrorModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
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
