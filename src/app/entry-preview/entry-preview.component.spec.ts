import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPreviewComponent } from './entry-preview.component';
import { TranslateModule } from '@ngx-translate/core';

describe('EntryPreviewComponent', () => {
  let component: EntryPreviewComponent;
  let fixture: ComponentFixture<EntryPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryPreviewComponent ],
      imports: [ TranslateModule.forRoot() ],
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
