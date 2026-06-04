import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../shared/interfaces/usuario.interface';
import { Publicacion } from '../../shared/interfaces/publicacion.interface';
import { MiPerfilService } from '../../core/services/miperfil.service';
import { AuthService } from '../../core/services/auth.service';

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

  constructor(private miperfilService: MiPerfilService, private authService: AuthService) {}

  ngOnInit(): void {    
    const usuarioSesion = this.authService.usuarioActual();
    
    if (usuarioSesion){
      this.cargarDatosPerfil(usuarioSesion.usuario);
    }else{
      this.errorMessage.set('No se encontró una sesión activa. Por favor inice sesión')
      this.isLoading.set(false);
    }
  }

  cargarDatosPerfil(username: string): void {
    this.miperfilService.obtenerDatosPerfil(username).subscribe({
      next: (user) => {
        this.usuario.set(user);
        // teniendo el usuario, traigo sus últimas 3 publicaciones filtradas
        this.cargarUltimasPublicaciones(user.usuario);
      },
      error: (err) => {
        this.errorMessage.set('No se pudo cargar la información del perfil.');
        this.isLoading.set(false);
      }
    });
  }

  cargarUltimasPublicaciones(username: string): void {
    // uso los parámetros de ordenamiento (por fecha), filtro de usuario y límite 3
        
    this.miperfilService.obtenerUltimasPublicaciones(username).subscribe({
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