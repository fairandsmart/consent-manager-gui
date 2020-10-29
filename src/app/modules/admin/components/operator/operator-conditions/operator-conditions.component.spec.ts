import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorConditionsComponent } from './operator-conditions.component';

describe('OperatorConditionsComponent', () => {
  let component: OperatorConditionsComponent;
  let fixture: ComponentFixture<OperatorConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorConditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
