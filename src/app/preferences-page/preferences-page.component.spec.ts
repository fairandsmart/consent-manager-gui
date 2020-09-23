import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesPageComponent } from './preferences-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PreferencesPageComponent', () => {
  let component: PreferencesPageComponent;
  let fixture: ComponentFixture<PreferencesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferencesPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
