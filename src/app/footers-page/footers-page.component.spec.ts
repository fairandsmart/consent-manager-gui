import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FootersPageComponent } from './footers-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FootersPageComponent', () => {
  let component: FootersPageComponent;
  let fixture: ComponentFixture<FootersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FootersPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FootersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
