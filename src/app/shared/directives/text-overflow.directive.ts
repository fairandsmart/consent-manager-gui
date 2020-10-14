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
