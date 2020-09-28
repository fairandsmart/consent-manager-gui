import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentsPageComponent } from './treatments-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TreatmentsPageComponent', () => {
  let component: TreatmentsPageComponent;
  let fixture: ComponentFixture<TreatmentsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatmentsPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
