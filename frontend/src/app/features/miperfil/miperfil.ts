import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../shared/interfaces/usuario.interface';
import { Publicacion } from '../../shared/interfaces/publicacion.interface';
import { AuthService } from '../../core/services/auth.service';
import {PublicacionesService} from '../../core/services/publicaciones.service'

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './miperfil.html',
  styleUrl: './miperfil.css'
})

export class MiPerfil implements OnInit {
  usuario = signal<Usuario | null>(null);
  ultimasPublicaciones = signal<Publicacion[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  limite = 3;

  constructor(private authService: AuthService, private publicacionesService : PublicacionesService) {}

  ngOnInit(): void {    
    const usuarioSesion = this.authService.usuarioActual();
    
    if (usuarioSesion){
      this.cargarDatosPerfil(usuarioSesion);
    }else{
      this.errorMessage.set('No se encontró una sesión activa. Por favor inice sesión')
      this.isLoading.set(false);
    }
  }

  cargarDatosPerfil(usuarioObj: any): void {
    this.usuario.set(usuarioObj);

    // teniendo el usuario, traigo sus últimas 3 publicaciones filtradas
    this.cargarUltimasPublicaciones(usuarioObj.usuario);
  }

  cargarUltimasPublicaciones(usuario: string): void {
    // uso los parámetros de ordenamiento (por fecha), filtro de usuario y límite 3
        
    this.publicacionesService.obtenerPublicaciones('fechaCreacion', this.limite, usuario).subscribe({
      next: (posts) => {
        this.ultimasPublicaciones.set(posts);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar las publicaciones.');
        this.isLoading.set(false);
      }
    });
  }
}