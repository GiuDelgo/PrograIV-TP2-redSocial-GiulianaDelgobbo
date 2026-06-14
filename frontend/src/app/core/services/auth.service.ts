import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment.production';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private baseUrl = `${environment.apiUrl}/auth`;
    usuarioActual = signal<any | null>(this.getUserStorage())

    //MODAL SESION
    mostrarModal = signal<boolean>(false);
    private timer: any;

    constructor(private http: HttpClient) {}

    login(usuario: string, contrasena: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/login`, { usuario, contrasena }).pipe(//encadenio operadores que procesan datos de un Observable
            tap (res => {//tap ejecuta una acción cuando el Observable emite un valor sin modificar dicho valor
                if (res){
                    localStorage.setItem('usuario_sesion', JSON.stringify(res));
                    this.usuarioActual.set(res);
                    //
                    this.iniciarContador();
                }
            })
        );
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

        return this.http.post(`${this.baseUrl}/registro`, formData, {withCredentials: true}).pipe(
            tap (res => {
                if (res){
                    localStorage.setItem('usuario_sesion', JSON.stringify(res));
                    this.usuarioActual.set(res);        
                }
            })
        );
        
    }

    
    
    validarToken(): Observable <any> {
        return this.http.post(`${this.baseUrl}/autorizar`, {});
    }

    iniciarContador (){
        this.limpiarContador();

        this.timer = setTimeout(()=>{
            this.mostrarModal.set(true);//muestro modal a los 10'
        }, 60 * 1000);
    }

    extenderSesion(): Observable<any>{
        return this.http.post(`${this.baseUrl}/refrescar`, {}).pipe(
            tap(()=>{
                this.mostrarModal.set(false);
                this.iniciarContador();
            })
        )
    }

    private getUserStorage ():any | null {
        const usuarioJson = localStorage.getItem('usuario_sesion');
        return usuarioJson ? JSON.parse(usuarioJson):null;
    }

    logout(): void {
        this.limpiarContador();
        this.mostrarModal.set(false);
        localStorage.removeItem('usuario_sesion');
        this.usuarioActual.set(null);
    }
    
    private limpiarContador(){
        if (this.timer){
            clearTimeout(this.timer);
        }
    }
}

