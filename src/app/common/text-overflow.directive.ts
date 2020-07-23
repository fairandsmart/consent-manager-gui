import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextOverflow]',
  exportAs: 'appTextOverflow'
})
export class TextOverflowDirective {

  overflowing = false;

  constructor(private element: ElementRef) {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.overflowing = this.element.nativeElement.scrollWidth > this.element.nativeElement.offsetWidth;
  }

}
