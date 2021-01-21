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
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[cmTextOverflow]',
  exportAs: 'cmTextOverflow'
})
export class TextOverflowDirective {

  overflowing = false;

  constructor(private element: ElementRef) {
  }

  @HostListener('mouseenter')
  onMouseEnter(): any {
    this.overflowing = this.element.nativeElement.scrollWidth > this.element.nativeElement.offsetWidth;
  }

}
