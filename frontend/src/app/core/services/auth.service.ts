import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment.production';
//import { environment } from '../../../environment';


@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private baseUrl = `${environment.apiUrl}/auth`;
    usuarioActual = signal<any | null>(this.getUserStorage())

    constructor(private http: HttpClient) {}

    login(usuario: string, contrasena: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/login`, { usuario, contrasena }).pipe(//encadenio operadores que procesan datos de un Observable
            tap (res => {//tap ejecuta una acción cuando el Observable emite un valor sin modificar dicho valor
                if (res && res.usuario){
                    localStorage.setItem('usuario_sesion', JSON.stringify(res.usuario));
                    this.usuarioActual.set(res.usuario);
                }
            })
        );
    }

    private getUserStorage ():any | null {
        const usuarioJson = localStorage.getItem('usuario_sesion');
        return usuarioJson ? JSON.parse(usuarioJson):null;
    }

    logout(): void {
        localStorage.removeItem('usuario_sesion');
        this.usuarioActual.set(null);
    }
    

    registro(datosFormulario: any, archivoFoto: File): Observable<any> {
        const formData = new FormData(); //uso formData para construir una petición HTTP multipart/form-data -> es el formato que utilizan los formularios HTML cuando envían archivos (binario de foto)
        
        // inyecto los campos de texto plano
        formData.append('nombre', datosFormulario.nombre);
        formData.append('apellido', datosFormulario.apellido);
        formData.append('correo', datosFormulario.correo);
        formData.append('usuario', datosFormulario.username);
        formData.append('contrasena', datosFormulario.password); 
        formData.append('fechaNacimiento', datosFormulario.nacimiento);
        formData.append('descripcion', datosFormulario.descripcion);
        
        // inyecta el archivo binario crudo que captura el onFileChange
        if (archivoFoto) {
            formData.append('foto', archivoFoto, archivoFoto.name); // 'foto' es el nombre que espera Multer
        }

        return this.http.post(`${this.baseUrl}/registro`, formData);
    }
}

