import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailComponent } from './email.component';
import { ModelsResourceService } from '../models-resource.service';
import { EntryInfoComponent } from '../entry-info/entry-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(async(() => {
    modelsResourceServiceSpy =  createSpyObj('ModelsResourceService', ['listEntries']);

    TestBed.configureTestingModule({
      declarations: [ EmailComponent, EntryInfoComponent, EntryPreviewComponent ],
      imports: [ ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot() ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
