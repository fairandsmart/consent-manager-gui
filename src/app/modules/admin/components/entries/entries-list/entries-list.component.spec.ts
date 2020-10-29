import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntriesListComponent } from './entries-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStubSpec } from '../../../../../testing/activated-route-stub.spec';
import { EMPTY } from 'rxjs';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('EntriesListComponent', () => {
  let component: EntriesListComponent;
  let fixture: ComponentFixture<EntriesListComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let activatedRouteStub: ActivatedRouteStubSpec;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    activatedRouteStub = new ActivatedRouteStubSpec();

    TestBed.configureTestingModule({
      declarations: [ EntriesListComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, FormsModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelsResourceServiceSpy.listEntries.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(EntriesListComponent);
    component = fixture.componentInstance;
    component.section = {
      id: 'infos',
      types: ['basicinfo'],
      multiple: true,
      showSort: true,
      displayDescription: false,
    };

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
