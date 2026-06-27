import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment.production';

@Injectable({
    providedIn: 'root'
})

export class EstadisticasService {
    urlBase = `${environment.apiUrl}/admin/estadisticas`;

    constructor(private http: HttpClient) {}
    
    // 1. Gráfico de Barras: Publicaciones por Usuario
    getGraficoBarras(fechaDesde: string, fechaHasta: string){
        

        let params = new HttpParams();
        params = params.set('desde', fechaDesde);
        params = params.set('hasta', fechaHasta);

        return this.http.get<any[]>(`${this.urlBase}/publicaciones-por-usuario`, { params });
    }
    

    // 2. Gráfico de Líneas: Comentarios en el tiempo
    getGraficoLineas(fechaDesde: string, fechaHasta: string){
        let params = new HttpParams();

        params = params.set('desde', fechaDesde);
        params = params.set('hasta', fechaHasta);

        return this.http.get<any[]>(`${this.urlBase}/comentarios-totales`, { params })
    }

    // 3. Gráfico de Torta (Pie): Comentarios por Publicación
    getGraficoTorta(fechaDesde: string, fechaHasta: string){
        let params = new HttpParams();

        params = params.set('desde', fechaDesde);
        params = params.set('hasta', fechaHasta);

        return this.http.get<any[]>(`${this.urlBase}/comentarios-por-publicacion`, { params })
    }
}