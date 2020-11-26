import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterrogatePageComponent } from './interrogate-page.component';
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import { EMPTY } from 'rxjs';
import { RecordsResourceService } from '../../../../core/http/records-resource.service';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('InterrogatePageComponent', () => {
  let component: InterrogatePageComponent;
  let fixture: ComponentFixture<InterrogatePageComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let recordsResourceServiceSpy: SpyObj<RecordsResourceService>;

  beforeEach(async () => {
    modelsResourceServiceSpy = createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    recordsResourceServiceSpy = createSpyObj<RecordsResourceService>('RecordsResourceService', ['extractRecords']);

    await TestBed.configureTestingModule({
      declarations: [ InterrogatePageComponent ],
      imports: [
        CoreTestingModule
      ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: RecordsResourceService, useValue: recordsResourceServiceSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    modelsResourceServiceSpy.listEntries.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(InterrogatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
