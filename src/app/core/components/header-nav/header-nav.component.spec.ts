import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderNavComponent } from './header-nav.component';
import { KeycloakService } from 'keycloak-angular';
import { CoreTestingModule } from '../../../testing/core-testing-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('HeaderNavComponent', () => {
  let component: HeaderNavComponent;
  let fixture: ComponentFixture<HeaderNavComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername']);

    TestBed.configureTestingModule({
      declarations: [ HeaderNavComponent ],
      imports: [ CoreTestingModule, RouterTestingModule ],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    keycloakServiceSpy.getUsername.and.returnValue('FOO BAR');

    fixture = TestBed.createComponent(HeaderNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
