import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment.production';
import { Injectable } from '@angular/core';
import { Usuario } from '../../shared/interfaces/usuario.interface';
import { Publicacion } from '../../shared/interfaces/publicacion.interface';

@Injectable({
    providedIn: 'root'
})

export class MiPerfilService {
    private baseUrl = `${environment.apiUrl}/miperfil`;

    constructor(private http: HttpClient) {}

    obtenerDatosPerfil(username: string) {
        return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/perfil/${username}`);    
    }

    obtenerUltimasPublicaciones(username: string) {
        return this.http.get<Publicacion[]>(`${this.baseUrl}/publicaciones?usuario=${username}&sort=fecha&limit=3&offset=0`);
    }
}