import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntryCardComponent } from './entry-card.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { AlertService } from '../../../../../core/services/alert.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EntryCardComponent', () => {
  let component: EntryCardComponent;
  let fixture: ComponentFixture<EntryCardComponent>;
  let alertServiceSpy: SpyObj<AlertService>;

  beforeEach(waitForAsync(() => {
    alertServiceSpy =  createSpyObj('AlertService', ['error']);

    TestBed.configureTestingModule({
      imports: [ CoreTestingModule ],
      declarations: [ EntryCardComponent ],
      providers: [
        {provide: AlertService, useValue: alertServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
