import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminPageComponent } from './admin-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderNavComponent } from '../../../../core/components/header-nav/header-nav.component';
import { KeycloakService } from 'keycloak-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '../../../../core/core.module';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('AdminPageComponent', () => {
  let component: AdminPageComponent;
  let fixture: ComponentFixture<AdminPageComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername']);

    TestBed.configureTestingModule({
      declarations: [ AdminPageComponent, HeaderNavComponent, SideNavComponent ],
      imports: [CoreModule, RouterTestingModule, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    keycloakServiceSpy.getUsername.and.returnValue('FOO BAR');

    fixture = TestBed.createComponent(AdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
