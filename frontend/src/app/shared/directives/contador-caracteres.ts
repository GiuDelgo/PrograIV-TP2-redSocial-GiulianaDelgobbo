import { Directive, ElementRef, Host, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appContadorCaracteres]',
})
export class ContadorCaracteres {
  @Input() maxCaracteres: number = 300; //cantidad máxima de caracteres

  constructor(private el:ElementRef, private renderer: Renderer2) {}

  @HostListener('input')
  onInput(){
    const total = this.el.nativeElement.value.length;

    if (total >= this.maxCaracteres){
      this.renderer.setStyle(this.el.nativeElement, 'border-color', '#dc3545');
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 0 0.25rem rgba(220, 53, 69, 0.25)');
    }else if (total >= this.maxCaracteres - 30){
      this.renderer.setStyle(this.el.nativeElement, 'border-color', '#f59172');
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 0 0.25rem rgba(244, 189, 173, 0.25)');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'border-color');
      this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
    }
  }
}
