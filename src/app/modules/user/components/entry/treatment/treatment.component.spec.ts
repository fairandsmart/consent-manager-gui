import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreatmentComponent } from './treatment.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('TreatmentComponent', () => {
  let component: TreatmentComponent;
  let fixture: ComponentFixture<TreatmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatmentComponent ],
      imports: [ CoreTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
