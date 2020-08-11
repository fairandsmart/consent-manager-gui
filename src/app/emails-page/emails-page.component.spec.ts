import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsPageComponent } from './emails-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EmailPageComponent', () => {
  let component: EmailsPageComponent;
  let fixture: ComponentFixture<EmailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailsPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
