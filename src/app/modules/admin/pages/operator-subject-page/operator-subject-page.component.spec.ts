import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorSubjectPageComponent } from './operator-subject-page.component';

describe('OperatorSubjectPageComponent', () => {
  let component: OperatorSubjectPageComponent;
  let fixture: ComponentFixture<OperatorSubjectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorSubjectPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorSubjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
