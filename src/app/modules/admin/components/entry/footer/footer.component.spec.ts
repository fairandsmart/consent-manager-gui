import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { TranslateModule } from '@ngx-translate/core';
import { EntryInfoComponent } from '../entry-info/entry-info.component';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';
import { CoreModule } from '../../../../../core/core.module';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EntryFooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj('ModelsResourceService', ['listEntries']);

    TestBed.configureTestingModule({
      declarations: [ FooterComponent, EntryInfoComponent, EntryPreviewComponent ],
      imports: [ CoreModule, ReactiveFormsModule, NoopAnimationsModule, TranslateModule.forRoot() ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
