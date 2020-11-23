import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRouteStubSpec } from '../../../../testing/activated-route-stub.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { KeysComponent } from './keys.component';
import { KeysResourceService } from '../../../../core/http/keys-resource.service';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('KeysComponent', () => {
  let component: KeysComponent;
  let fixture: ComponentFixture<KeysComponent>;
  let keysResourceServiceSpy: SpyObj<KeysResourceService>;
  let activatedRouteStub: ActivatedRouteStubSpec;

  beforeEach(waitForAsync(() => {
    keysResourceServiceSpy =  createSpyObj<KeysResourceService>('KeysResourceService', ['listKeys', 'createKey', 'deleteKey']);
    activatedRouteStub = new ActivatedRouteStubSpec();

    TestBed.configureTestingModule({
      declarations: [ KeysComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, ReactiveFormsModule ],
      providers: [
        {provide: KeysResourceService, useValue: keysResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    keysResourceServiceSpy.listKeys.and.returnValue(EMPTY);
    keysResourceServiceSpy.createKey.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(KeysComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
