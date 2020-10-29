import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorProcessingComponent } from './operator-processing.component';

describe('OperatorProcessingComponent', () => {
  let component: OperatorProcessingComponent;
  let fixture: ComponentFixture<OperatorProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorProcessingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
