/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 *
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 *
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryEditorContainerComponent } from './entry-editor-container.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';

describe('EntryEditorContainerComponent', () => {
  let component: EntryEditorContainerComponent;
  let fixture: ComponentFixture<EntryEditorContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryEditorContainerComponent, EntryPreviewComponent ],
      imports: [ CoreTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryEditorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
