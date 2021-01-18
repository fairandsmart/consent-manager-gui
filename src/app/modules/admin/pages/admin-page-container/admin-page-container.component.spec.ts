import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminPageContainerComponent } from './admin-page-container.component';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { EMPTY } from 'rxjs';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('AdminPageContainerComponent', () => {
  let component: AdminPageContainerComponent;
  let fixture: ComponentFixture<AdminPageContainerComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername', 'isUserInRole']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listSubjects']);

    TestBed.configureTestingModule({
      declarations: [ AdminPageContainerComponent, SideNavComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, NoopAnimationsModule ],
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

    fixture = TestBed.createComponent(AdminPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
