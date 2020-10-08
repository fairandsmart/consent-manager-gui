import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderNavComponent } from './header-nav.component';
import { KeycloakService } from 'keycloak-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../material.module';
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
      imports: [ TranslateModule.forRoot(), MaterialModule ],
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
