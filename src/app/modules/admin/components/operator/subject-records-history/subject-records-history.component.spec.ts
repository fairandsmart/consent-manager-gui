import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectRecordsHistoryComponent } from './subject-records-history.component';

describe('SubjectRecordsHistoryComponent', () => {
  let component: SubjectRecordsHistoryComponent;
  let fixture: ComponentFixture<SubjectRecordsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectRecordsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectRecordsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
