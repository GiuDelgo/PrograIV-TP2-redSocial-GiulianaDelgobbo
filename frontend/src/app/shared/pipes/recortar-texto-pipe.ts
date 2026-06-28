import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recortarTexto',
})
export class RecortarTextoPipe implements PipeTransform {
  transform(valor: string, limite: number = 200): string {
    if (!valor) return '';
    return valor.length > limite ? valor.substring(0, limite) + '...' : valor;
  }
}
