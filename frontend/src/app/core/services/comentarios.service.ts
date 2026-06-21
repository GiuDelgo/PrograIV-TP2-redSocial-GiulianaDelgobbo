import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environment.production';
import { Comentario } from '../../shared/interfaces/comentario.interface';

@Injectable({
    providedIn: 'root'
})

export class ComentariosService {
  private baseUrl = `${environment.apiUrl}/comentarios`;
  private comentarioCreadoSubject = new Subject<void>(); 

  comentarioCreado$ = this.comentarioCreadoSubject.asObservable(); 

  constructor(private http: HttpClient) {}
  
  comentarPublicacion (publicacionId: string, usuarioId: string, usuarioNombre: string, descripcion: string): Observable<any> {
    const comentarioBody = {
      publicacionId: publicacionId, 
      usuarioId: usuarioId, 
      usuarioNombre: usuarioNombre, 
      descripcion: descripcion 
    }

    return this.http.post(this.baseUrl, comentarioBody).pipe(
      tap(() => {
        this.comentarioCreadoSubject.next();
      })
    );
  }

  obtenerComentarios(idPublicacion:string, limite?:number, offset?:number): Observable<Comentario[]> {
    const url = `${this.baseUrl}/publicacion/${idPublicacion}`;

    let params = new HttpParams();

    if (limite !== undefined) params = params.set('limit', limite.toString());
    if (offset !== undefined) params = params.set('offset', offset.toString());


    return this.http.get<Comentario[]>(url, { params });
  }

  editarComentario(comentarioId: string, comentaroBody: string):Observable<any>{
    const url = `${this.baseUrl}/${comentarioId}`;

    const comentarioBody = {
      descripcion: comentaroBody 
    }

    return this.http.put(url, comentarioBody).pipe(
      tap(() => {
        this.comentarioCreadoSubject.next();
      })
    );
  }
}
