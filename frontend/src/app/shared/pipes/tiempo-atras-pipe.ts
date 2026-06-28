import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempoAtras',
})

export class TiempoAtrasPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const fecha = new Date(value);
    const segundos = Math.floor((new Date().getTime() - fecha.getTime())/1000);
    
    let intervalo = Math.floor(segundos/31536000);//segundo en un año
    if (intervalo >= 1) return `Hace ${intervalo} año${intervalo > 1 ? 's' : ''}`;

    intervalo = Math.floor(segundos/2592000);//segundos en un mes
    if (intervalo >= 1) return `Hace ${intervalo} me${intervalo > 1 ? 'ses' : 's'}`;

    intervalo = Math.floor(segundos/86400); //segundos en un día
    if (intervalo >= 1) return `Hace ${intervalo} día${intervalo > 1 ? 's' : ''}`;
    
    intervalo = Math.floor (segundos/3600); //segundos en una hora
    if (intervalo >=1 ) return `Hace ${intervalo} hora${intervalo > 1 ? 's' : ''}`;

    intervalo = Math.floor(segundos / 60); //segundos en un minuto
    if (intervalo >= 1) return `Hace ${intervalo} minuto${intervalo > 1 ? 's' : ''}`;
    return 'hace unos segundos';
  }
}
