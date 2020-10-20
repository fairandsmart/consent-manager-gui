import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntryCardComponent } from './entry-card.component';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { EMPTY } from 'rxjs';

describe('EntryCardComponent', () => {
  let component: EntryCardComponent;
  let fixture: ComponentFixture<EntryCardComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['getActiveVersion']);

    TestBed.configureTestingModule({
      declarations: [ EntryCardComponent ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelsResourceServiceSpy.getActiveVersion.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(EntryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
