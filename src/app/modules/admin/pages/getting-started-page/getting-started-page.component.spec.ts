import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStartedPageComponent } from './getting-started-page.component';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

describe('GettingStartedPageComponent', () => {
  let component: GettingStartedPageComponent;
  let fixture: ComponentFixture<GettingStartedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GettingStartedPageComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, NoopAnimationsModule, TranslateModule.forRoot() ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStartedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
