import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsComponent } from './records.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ConsentsResourceService } from '../consents-resource.service';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EMPTY } from 'rxjs';
import { FormsModule } from '@angular/forms';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('RecordsComponent', () => {
  let component: RecordsComponent;
  let fixture: ComponentFixture<RecordsComponent>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;

  beforeEach(async(() => {
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['listRecords']);

    TestBed.configureTestingModule({
      declarations: [ RecordsComponent ],
      imports: [ FormsModule, RouterTestingModule, MaterialModule, NoopAnimationsModule ],
      providers: [
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    consentsResourceServiceSpy.listRecords.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(RecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
