import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment.production';
import { Publicacion } from '../../features/posts/interfaces/publicacion.interface';

@Injectable({
    providedIn: 'root'
})

export class PublicacionesService {
    private baseUrl = `${environment.apiUrl}/publicaciones`;

    constructor(private http: HttpClient) {}

    obtenerPublicaciones(ordenActual:string, limite:number, offset:number): Observable<{ data: Publicacion[], total: number }> {

        const url = `${this.baseUrl}?orden=${ordenActual}&limit=${limite}&offset=${offset}`;
        return this.http.get<{ data: Publicacion[]; total: number }>(url);
    }

    deleteLike (idPublicacion: string): Observable<any> {
        const url = `${this.baseUrl}/${idPublicacion}/like`;
        return this.http.delete(url);
    }

    addLike (idPublicacion: string): Observable<any> {
        const url = `${this.baseUrl}/${idPublicacion}/like`;
        return this.http.post(url, {});
    }

    deletePublicacion (idPublicacion: string): Observable<any> {
        const url = `${this.baseUrl}/${idPublicacion}`;
        return this.http.patch(url, { eliminada: true });//baja logica, no borrado físico
    }

}