import { Directive, EventEmitter, HostListener, Output, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appConfirmarBorrado]',
})

export class ConfirmarBorrado {
  @Output() confirmado = new EventEmitter<void>();
  private primerClick = false;

  constructor(private el:ElementRef, private renderer: Renderer2) {}

  @HostListener ('click', ['$event'])
    onclick(event: Event){
      event.preventDefault();

      if (!this.primerClick) {
        this.primerClick = true;
        this.renderer.setProperty(this.el.nativeElement, 'innerText', ' ⚠️¿Seguro?⚠️');
        this.renderer.removeClass(this.el.nativeElement, 'btn-outline-danger');
        this.renderer.addClass(this.el.nativeElement, 'btn-danger');

        setTimeout(() => {
          this.primerClick = false;
          this.renderer.setProperty(this.el.nativeElement, 'innerText', 'Eliminar');
          this.renderer.removeClass(this.el.nativeElement, 'btn-danger');
          this.renderer.addClass(this.el.nativeElement, 'btn-outline-danger');
        }, 3000);

      } else {
        this.confirmado.emit(); 
      }
    }
  }
