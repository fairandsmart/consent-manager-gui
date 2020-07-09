import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemesPageComponent } from './themes-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ThemesPageComponent', () => {
  let component: ThemesPageComponent;
  let fixture: ComponentFixture<ThemesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThemesPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
