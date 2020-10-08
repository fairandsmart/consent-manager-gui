import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntryPreviewComponent } from './entry-preview.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('EntryPreviewComponent', () => {
  let component: EntryPreviewComponent;
  let fixture: ComponentFixture<EntryPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryPreviewComponent ],
      imports: [ CoreTestingModule ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
