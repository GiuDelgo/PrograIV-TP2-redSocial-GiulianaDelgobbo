import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../shared/interfaces/usuario.interface';
import { Publicacion } from '../../shared/interfaces/publicacion.interface';
import { Comentario } from '../../shared/interfaces/comentario.interface';
import { AuthService } from '../../core/services/auth.service';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { ComentariosService } from '../../core/services/comentarios.service';
import { forkJoin, map, switchMap, of } from 'rxjs';

interface PublicacionPerfil extends Publicacion {
  ultimosComentarios: Comentario[];
  totalComentarios: number;
}

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './miperfil.html',
  styleUrl: './miperfil.css'
})

export class MiPerfil implements OnInit {
  usuario = signal<Usuario | null>(null);
  ultimasPublicaciones = signal<PublicacionPerfil[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  limitePublicaciones = 3;
  limiteComentarios = 5;

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
    private comentariosService: ComentariosService
  ) {}

  ngOnInit(): void {
    const usuarioSesion = this.authService.usuarioActual();

    if (usuarioSesion) {
      this.cargarDatosPerfil(usuarioSesion);
    } else {
      this.errorMessage.set('No se encontró una sesión activa. Por favor inice sesión');
      this.isLoading.set(false);
    }
  }

  cargarDatosPerfil(usuarioObj: Usuario): void {
    this.usuario.set(usuarioObj);
    this.cargarUltimasPublicaciones(usuarioObj.usuario);
  }

  cargarUltimasPublicaciones(usuario: string): void {
    this.publicacionesService
      .obtenerPublicaciones('createdAt', this.limitePublicaciones, undefined, usuario)
      .pipe(
        switchMap((posts) => {
          if (posts.length === 0) {
            return of([] as PublicacionPerfil[]);
          }

          return forkJoin(
            posts.map((post) => {
              const totalComentarios = Array.isArray(post.comentarios) ? post.comentarios.length : 0;

              return this.comentariosService
                .obtenerComentarios(post._id, this.limiteComentarios, 0)
                .pipe(
                  map((comentarios) => ({
                    ...post,
                    ultimosComentarios: comentarios,
                    totalComentarios,
                  }))
                );
            })
          );
        })
      )
      .subscribe({
        next: (posts) => {
          this.ultimasPublicaciones.set(posts);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al cargar las publicaciones.');
          this.isLoading.set(false);
        },
      });
  }
}
