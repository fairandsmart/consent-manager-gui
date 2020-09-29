import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModelsResourceService } from '../services/models-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { TranslateModule } from '@ngx-translate/core';
import { EntryInfoComponent } from '../entry-info/entry-info.component';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(async(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);

    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, EntryInfoComponent, EntryPreviewComponent ],
      imports: [ ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot() ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
