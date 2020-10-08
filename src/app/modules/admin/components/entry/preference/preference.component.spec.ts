import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreferenceComponent } from './preference.component';
import { EntryInfoComponent } from '../entry-info/entry-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('PreferenceComponent', () => {
  let component: PreferenceComponent;
  let fixture: ComponentFixture<PreferenceComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj('ModelsResourceService', ['listEntries']);

    TestBed.configureTestingModule({
      declarations: [ PreferenceComponent, EntryInfoComponent, EntryPreviewComponent ],
      imports: [ CoreTestingModule, ReactiveFormsModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
