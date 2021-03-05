import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelVersionSelectorComponent } from './model-version-selector.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('ModelVersionSelectorComponent', () => {
  let component: ModelVersionSelectorComponent;
  let fixture: ComponentFixture<ModelVersionSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelVersionSelectorComponent ],
      imports: [ CoreTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelVersionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
