import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsComponent } from './records.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EMPTY } from 'rxjs';
import { FormsModule } from '@angular/forms';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { TranslateModule } from '@ngx-translate/core';
import { RecordsResourceService } from '../records-resource.service';

describe('RecordsComponent', () => {
  let component: RecordsComponent;
  let fixture: ComponentFixture<RecordsComponent>;
  let recordsResourceServiceSpy: SpyObj<RecordsResourceService>;

  beforeEach(async(() => {
    recordsResourceServiceSpy =  createSpyObj<RecordsResourceService>('RecordsResourceService', ['listRecords']);

    TestBed.configureTestingModule({
      declarations: [ RecordsComponent ],
      imports: [ FormsModule, RouterTestingModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot() ],
      providers: [
        {provide: RecordsResourceService, useValue: recordsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    recordsResourceServiceSpy.listRecords.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(RecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
