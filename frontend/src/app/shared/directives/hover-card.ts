import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverCard]',
})
export class HoverCard {
  constructor(private el:ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.3s ease');
  }

  @HostListener('mouseenter') onMouseEnter (){
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-5px)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 8px 16px rgba(98, 170, 172, 0.3)')
  }

  @HostListener('mouseleave') onMouseLeave (){
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none');
  }

}
