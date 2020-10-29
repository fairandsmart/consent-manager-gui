import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorPreferencesComponent } from './operator-preferences.component';

describe('OperatorPreferencesComponent', () => {
  let component: OperatorPreferencesComponent;
  let fixture: ComponentFixture<OperatorPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorPreferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
