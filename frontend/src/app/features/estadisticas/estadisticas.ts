import { Component, OnInit, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { EstadisticasService } from '../../core/services/estadisticas.service';

Chart.register(...registerables);//registerable es un componente modular, hay que cargarlo a mano antes de usarlo dentro de la librería. Es como si fuese el cartucho de una consola

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule, FormsModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})

export class Estadisticas implements OnInit {
  fechaDesde = signal<string>('2026-01-01');
  fechaHasta = signal<string>('2026-12-31');

  //obtengo las referencias a los elementos canvas del DOM para renderizar los gráficos adentro
  @ViewChild('chartUsuarios') chartUsuariosRef!: ElementRef;
  @ViewChild('chartComentarios') chartComentariosRef!: ElementRef;
  @ViewChild('chartPubComentarios') chartPubComentariosRef!: ElementRef;

  private charts: Chart[] = []; //me guardo las intancias de los gráficos en el array

  constructor (private estadisticasService: EstadisticasService){}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    // destruyo  gráficos anteriores si existen
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    const desde = this.fechaDesde().toString();
    const hasta = this.fechaHasta().toString();

    //llamo a cada método del servicio para traer las estadísticas
    //1. Gráfico de Barras: Publicaciones por Usuario
    this.estadisticasService.getGraficoBarras(desde, hasta).subscribe({
      next: (res)=>{
        const labels = res.map(item => item._id);
        const data = res.map(item => item.cantidad);
        this.crearGrafico(this.chartUsuariosRef.nativeElement, 'bar', 'Publicaciones por Usuario', labels, data, '#62aaac');
      }
    });

    // 2. Gráfico de Líneas: Comentarios en el tiempo
    this.estadisticasService.getGraficoLineas(desde, hasta).subscribe({
      next: (res)=>{
        const labels = res.map(item => item._id);
        const data = res.map(item => item.cantidad);
        this.crearGrafico(this.chartComentariosRef.nativeElement, 'line', 'Comentarios por Día', labels, data, '#f4bdad');
      }
    })

    // 3. Gráfico de Torta: Comentarios por Publicación
    this.estadisticasService.getGraficoTorta(desde, hasta).subscribe({
      next: (res)=>{
        const labels = res.map(item => `Post ID: ...${item._id}`);
        const data = res.map(item => item.cantidad);
        this.crearGrafico(this.chartPubComentariosRef.nativeElement, 'pie', 'Distribución de Comentarios', labels, data, ['#62aaac', '#c1b788', '#f4bdad', '#4a5553']);
      }
    })
    
  }

  private crearGrafico(canvas: any, type: any, label: string, labels: string[], data: number[], bgColors: any) {
    const nuevoChart = new Chart(canvas, {
      type: type, //tipo de gráfico
      data: { //info que se va a mostrar en el gráfico
        labels: labels, //nombres de la variables a mostrar
        datasets: [{
          label: label,
          data: data,
          backgroundColor: bgColors,
          borderWidth: 1
        }]
      },
      options: { responsive: true } //cambia de tamaño automáticamente
    });
    this.charts.push(nuevoChart);
  }
}

