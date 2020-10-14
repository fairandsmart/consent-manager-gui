import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicinfoComponent } from './basicinfo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { EntryInfoComponent } from '../entry-info/entry-info.component';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('BasicinfoComponent', () => {
  let component: BasicinfoComponent;
  let fixture: ComponentFixture<BasicinfoComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);

    TestBed.configureTestingModule({
      declarations: [ BasicinfoComponent, EntryInfoComponent, EntryPreviewComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, ReactiveFormsModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
