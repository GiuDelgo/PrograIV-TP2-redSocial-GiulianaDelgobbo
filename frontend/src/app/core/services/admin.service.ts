import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment.production'
import { Usuario } from '../../shared/interfaces/usuario.interface'

@Injectable ({
    providedIn: 'root'
})

export class AdminService {
    private baseUrl = `${environment.apiUrl}/auth/admin`;

    constructor (private http: HttpClient){}

    getusuariosAdmin(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`);
    }

    registrarUsuarioAdmin(usuarioData: any, foto: File) : Observable<any>{
        const formData = new FormData();

        formData.append('nombre', usuarioData.nombre);
        formData.append('apellido', usuarioData.apellido);
        formData.append('correo', usuarioData.correo);
        formData.append('usuario', usuarioData.usuario);
        formData.append('contrasena', usuarioData.contrasena);
        formData.append('fechaNacimiento', usuarioData.fechaNacimiento);
        formData.append('descripcion', usuarioData.descripcion);
        formData.append('foto', usuarioData.foto);
        formData.append('perfil', usuarioData.perfil);

        return this.http.post<Usuario[]>(`${this.baseUrl}/registrar`, formData);
    }

    bajaUsuario(id: string):Observable<any>{
        return this.http.delete<Usuario>(`${this.baseUrl}/baja/${id}`);
    }

    altaUsuario(id:string):Observable<Usuario>{
        return this.http.post<Usuario>(`${this.baseUrl}/alta`, { _id: id });
    }
}