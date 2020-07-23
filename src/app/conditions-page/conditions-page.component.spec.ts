import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsPageComponent } from './conditions-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ConditionsPageComponent', () => {
  let component: ConditionsPageComponent;
  let fixture: ComponentFixture<ConditionsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionsPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
