import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iniciales',
})
export class InicialesPipe implements PipeTransform {
  transform(valor: string): string {
    if (!valor) return '';
    
    const palabras = valor.trim().split(' ');
    if (palabras.length > 1) {
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return valor.substring(0, 2).toUpperCase();
  }
}

