import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment.production';
import { Publicacion } from '../../shared/interfaces/publicacion.interface';

@Injectable({
    providedIn: 'root'
})

export class PublicacionesService {
    private baseUrl = `${environment.apiUrl}/publicaciones`;

    constructor(private http: HttpClient) {}

    subirPublicacion(titulo: string, descripcion: string, usuarioId: string, usuarioNombre: string, foto?: File): Observable<any> {
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('usuarioId', usuarioId);
        formData.append('usuarioNombre', usuarioNombre);
        if (foto) {
            formData.append('foto', foto);
        }
        return this.http.post(this.baseUrl, formData);
    }

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
        return this.http.delete(url);//baja logica, no borrado físico
    }

}