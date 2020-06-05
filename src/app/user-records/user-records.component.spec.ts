import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecordsComponent } from './user-records.component';

describe('UserRecordsComponent', () => {
  let component: UserRecordsComponent;
  let fixture: ComponentFixture<UserRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
