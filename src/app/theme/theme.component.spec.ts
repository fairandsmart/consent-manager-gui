import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeComponent } from './theme.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModelsResourceService } from '../services/models-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { TranslateModule } from '@ngx-translate/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EntryInfoComponent } from '../entry-info/entry-info.component';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';

describe('ThemeComponent', () => {
  let component: ThemeComponent;
  let fixture: ComponentFixture<ThemeComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(async(() => {
    modelsResourceServiceSpy =  createSpyObj('ModelsResourceService', ['listEntries']);

    TestBed.configureTestingModule({
      declarations: [ ThemeComponent, EntryInfoComponent, EntryPreviewComponent ],
      imports: [ ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot(), CodemirrorModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
