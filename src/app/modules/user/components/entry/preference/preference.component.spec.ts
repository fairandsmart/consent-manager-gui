import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreferenceComponent } from './preference.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('PreferenceComponent', () => {
  let component: PreferenceComponent;
  let fixture: ComponentFixture<PreferenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceComponent ],
      imports: [ CoreTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
