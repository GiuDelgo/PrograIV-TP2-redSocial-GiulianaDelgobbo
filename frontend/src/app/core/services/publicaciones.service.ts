import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environment.production';
import { Publicacion } from '../../shared/interfaces/publicacion.interface';
import { offset } from '@popperjs/core';

@Injectable({
    providedIn: 'root'
})

export class PublicacionesService {
    private baseUrl = `${environment.apiUrl}/publicaciones`;
    private postCreadoSubject = new Subject<void>(); //el subject permite emitir eventos desde el servicio, en este caso para notificar a Publicaciones que se creó un nuevo post y recargar la lista
    postCreado$ = this.postCreadoSubject.asObservable(); //exponer el subject como un observable para que otros componentes puedan suscribirse, pero no emitir eventos

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

        return this.http.post(this.baseUrl, formData).pipe(//REMINDER: encadeno operadores, en este caso me habilita a usar 
            tap(() => { // tap sirve para ejecutar código adicional sin afectar la respuesta de la petición
                this.postCreadoSubject.next(); // dispara la notificación reactiva global, si solo hago la peticion sin el tap, Publicaciones no se enteraría que se creó un nuevo post y no recargaría la lista automáticamente
            })
        );
    }

    obtenerPublicaciones(orden?:string, limite?:number, offset?:number, usuarioNombre?:string): Observable<Publicacion[]> {
        let params = new HttpParams();

        if (usuarioNombre) params = params.set('usuarioNombre', usuarioNombre);
        if (limite) params = params.set('limite', limite.toString());
        if (orden) params = params.set('orden', orden);
        if (offset !== undefined) params = params.set('offset', offset.toString());

        return this.http.get<Publicacion[]>(this.baseUrl, { params });
    }

    addLike (idPublicacion: string, usuarioId:string): Observable<any> {
        const url = `${this.baseUrl}/${idPublicacion}/like`;
        return this.http.post(url, {usuarioId});
    }
    
    deleteLike (idPublicacion: string, usuarioId:string): Observable<any> {
        const url = `${this.baseUrl}/${idPublicacion}/like/${usuarioId}`;
        return this.http.delete(url);
    }    

    deletePublicacion (idPublicacion: string): Observable<any> {
        const url = `${this.baseUrl}/${idPublicacion}`;
        return this.http.delete(url);//baja logica, no borrado físico
    }

}