import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenCreationComponent } from './token-creation.component';
import { ConsentsResourceService } from '../consents-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TokenCreationComponent', () => {
  let component: TokenCreationComponent;
  let fixture: ComponentFixture<TokenCreationComponent>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;

  beforeEach(async(() => {
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['listUserRecords']);

    TestBed.configureTestingModule({
      declarations: [ TokenCreationComponent ],
      imports: [ ReactiveFormsModule, MaterialModule, NoopAnimationsModule ],
      providers: [
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
