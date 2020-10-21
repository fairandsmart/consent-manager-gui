import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntryCardComponent } from './entry-card.component';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { EMPTY } from 'rxjs';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EntryCardComponent', () => {
  let component: EntryCardComponent;
  let fixture: ComponentFixture<EntryCardComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['getActiveVersion']);

    TestBed.configureTestingModule({
      declarations: [ EntryCardComponent ],
      imports: [ CoreTestingModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelsResourceServiceSpy.getActiveVersion.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(EntryCardComponent);
    component = fixture.componentInstance;
    component.entry = {id: 'FOOBAR'} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
