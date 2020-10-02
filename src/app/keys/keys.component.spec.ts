import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRouteStub } from '../testing/activated-route-stub';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { KeysComponent } from './keys.component';
import { KeysResourceService } from '../services/keys-resource.service';
import { Key } from '../models';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('KeysComponent', () => {
  let component: KeysComponent;
  let fixture: ComponentFixture<KeysComponent>;
  let keysResourceServiceSpy: SpyObj<KeysResourceService>;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async(() => {
    keysResourceServiceSpy =  createSpyObj<KeysResourceService>('KeysResourceService', ['listKeys']);
    activatedRouteStub = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [ KeysComponent ],
      imports: [ RouterTestingModule, ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot() ],
      providers: [
        {provide: KeysResourceService, useValue: keysResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const keys: Key[] = [];
    keysResourceServiceSpy.listKeys.and.returnValue(of(keys));

    fixture = TestBed.createComponent(KeysComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
