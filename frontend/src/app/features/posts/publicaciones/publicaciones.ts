import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../../shared/interfaces/publicacion.interface';
import { PublicacionCard } from '../publicacion-card/publicacion-card';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, PublicacionCard],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})

export class Publicaciones implements OnInit, OnDestroy {
  publicaciones: Publicacion[] = [];
  
  errorMessage = signal<string | null>(null);

  ordenActual: 'fechaCreacion' | 'likes' = 'fechaCreacion';
  limite: number = 5; 
  offset: number = 0; 
  totalPublicaciones: number = 0; // para deshabilitar botones de paginado
  usuarioId = ''; // SPRINT 3: Reemplazar con lógica real de autenticación
  private postSub!: Subscription;

  constructor(private publicacionesService: PublicacionesService, private authService: AuthService) {}

  ngOnInit() {
    this.cargarPublicaciones();

    const usuarioSesion = this.authService.usuarioActual();

    if (usuarioSesion){
      this.usuarioId = usuarioSesion._id;
    }else{
      this.errorMessage.set('No se encontró una sesión activa. Por favor inice sesión')
    }

    // Cada vez que se cree un post en cualquier lugar de la app esto se ejecuta
    this.postSub = this.publicacionesService.postCreado$.subscribe(() => {
      this.offset = 0;
      this.cargarPublicaciones(); 
    });
  }

  ngOnDestroy() {
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
  }

  cargarPublicaciones() {
    this.publicacionesService.obtenerPublicaciones(this.ordenActual, this.limite).subscribe({
      next: (res) => {
        this.publicaciones = res;
        this.totalPublicaciones = this.publicaciones.length;
      },
      error: (err) => {
        const mensajeError = err.error?.message || 'Error al cargar publicaciones';
        this.errorMessage.set(mensajeError)
      }
    });
  }

  cambiarOrden(nuevoOrden: 'fechaCreacion' | 'likes') {
    if (this.ordenActual !== nuevoOrden) {
      this.ordenActual = nuevoOrden;
      this.offset = 0; // Reinicio paginación al reordenar
      this.cargarPublicaciones();
    }
  }

  // paginación sin scroll infinito, solo botones Siguiente y Anterior
  paginaSiguiente() {
    if (this.offset + this.limite < this.totalPublicaciones) {
      this.offset += this.limite;
      this.cargarPublicaciones();
    }
  }

  paginaAnterior() {
    if (this.offset - this.limite >= 0) {
      this.offset -= this.limite;
      this.cargarPublicaciones();
    }
  }

  handleLike(idPublicacion: string) {
    const post = this.publicaciones.find(p => p._id === idPublicacion);
    if (!post) return;

    const isLiked = post.likes.includes(this.usuarioId);
    
    if (isLiked) {
      // DELETE al backend para remover like
      this.publicacionesService.deleteLike(idPublicacion).subscribe({
        next: () => {
          post.likes = post.likes.filter(id => id !== this.usuarioId);
        }
      });
    } else {
      // POST al backend para agregar like
      this.publicacionesService.addLike(idPublicacion).subscribe({
        next: () => {
          post.likes.push(this.usuarioId);
        }
      });
    }
  }

  handleDelete(idPublicacion: string) {
    this.publicacionesService.deletePublicacion(idPublicacion).subscribe({
      next: () => {
        // quito del arreglo visual local
        this.publicaciones = this.publicaciones.filter(p => p._id !== idPublicacion);
        this.totalPublicaciones--;
      },
      error: (err) => {
        const mensajeError = err.error?.message || 'No se pudo eliminar la publicación';
        this.errorMessage.set(mensajeError)
      }
    });
  }
}
