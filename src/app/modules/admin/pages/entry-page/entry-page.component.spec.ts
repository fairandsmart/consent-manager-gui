import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntryPageComponent } from './entry-page.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStubSpec } from '../../../../testing/activated-route-stub.spec';
import { EMPTY } from 'rxjs';
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EntryPageComponent', () => {
  let component: EntryPageComponent;
  let fixture: ComponentFixture<EntryPageComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let activatedRouteStub: ActivatedRouteStubSpec;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['getEntry', 'getVersion']);
    activatedRouteStub = new ActivatedRouteStubSpec({
      params: {
        id: '123e4567-e89b-12d3-a456-426614174000'
      }
    });

    TestBed.configureTestingModule({
      declarations: [ EntryPageComponent ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelsResourceServiceSpy.getEntry.and.returnValue(EMPTY);
    modelsResourceServiceSpy.getVersion.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(EntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
