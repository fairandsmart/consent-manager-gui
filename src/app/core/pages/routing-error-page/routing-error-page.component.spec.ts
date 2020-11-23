import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoutingErrorPageComponent } from './routing-error-page.component';
import { CoreTestingModule } from '../../../testing/core-testing-module.spec';
import { KeycloakService } from 'keycloak-angular';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { RouterTestingModule } from '@angular/router/testing';
import { SubjectsResourceService } from '../../http/subjects-resource.service';
import { EMPTY } from 'rxjs';

describe('RoutingErrorPageComponent', () => {
  let component: RoutingErrorPageComponent;
  let fixture: ComponentFixture<RoutingErrorPageComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername', 'isUserInRole']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listSubjects']);

    TestBed.configureTestingModule({
      declarations: [ RoutingErrorPageComponent ],
      imports: [ CoreTestingModule, RouterTestingModule ],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    keycloakServiceSpy.getUsername.and.returnValue('FOO BAR');
    keycloakServiceSpy.isUserInRole.and.returnValue(true);
    subjectsResourceServiceSpy.listSubjects.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(RoutingErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
