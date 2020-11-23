import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OperatorSubjectPageComponent } from './operator-subject-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import { HttpClientModule } from '@angular/common/http';
import { ConsentsResourceService } from '../../../../core/http/consents-resource.service';
import SpyObj = jasmine.SpyObj;
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { ActivatedRouteStubSpec } from '../../../../testing/activated-route-stub.spec';
import createSpyObj = jasmine.createSpyObj;
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';

describe('OperatorSubjectPageComponent', () => {
  let component: OperatorSubjectPageComponent;
  let fixture: ComponentFixture<OperatorSubjectPageComponent>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;
  let activatedRouteStub: ActivatedRouteStubSpec;

  beforeEach(waitForAsync(() => {
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['generateToken', 'postConsent']);
    subjectsResourceServiceSpy =  createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['getSubject', 'listCustomerRecords', 'updateSubject', 'createSubject']);
    activatedRouteStub = new ActivatedRouteStubSpec({
      params: {
        subject: 'foobar'
      }
    });

    TestBed.configureTestingModule({
      declarations: [ OperatorSubjectPageComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, HttpClientModule ],
      providers: [
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    consentsResourceServiceSpy.generateToken.and.returnValue(of('foobar'));
    consentsResourceServiceSpy.postConsent.and.returnValue(of('foobar'));
    subjectsResourceServiceSpy.getSubject.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(OperatorSubjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
