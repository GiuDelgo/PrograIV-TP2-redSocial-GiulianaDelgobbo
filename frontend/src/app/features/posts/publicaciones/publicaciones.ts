import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../../shared/interfaces/publicacion.interface';
import { PublicacionCard } from '../publicacion-card/publicacion-card';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, PublicacionCard],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})

export class Publicaciones implements OnInit, OnDestroy {
  publicaciones: Publicacion[] = [];

  ordenActual: 'fecha' | 'likes' = 'fecha';
  limite: number = 5; 
  offset: number = 0; 
  totalPublicaciones: number = 0; // para deshabilitar botones de paginado
  idUsuarioLogueado: string = 'ID_DEL_TOKEN'; // SPRINT 3: Reemplazar con lógica real de autenticación
  private postSub!: Subscription;

  constructor(private publicacionesService: PublicacionesService) {}

  ngOnInit() {
    this.cargarPublicaciones();

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
    this.publicacionesService.obtenerPublicaciones(this.ordenActual, this.limite, this.offset).subscribe({
      next: (res) => {
        this.publicaciones = res.data || res;
        this.totalPublicaciones = res.total || this.publicaciones.length; // si el backend no envía total
      },
      error: (err) => console.error('Error al cargar publicaciones:', err)
    });
  }

  cambiarOrden(nuevoOrden: 'fecha' | 'likes') {
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

    const isLiked = post.likes.includes(this.idUsuarioLogueado);
    
    if (isLiked) {
      // DELETE al backend para remover like
      this.publicacionesService.deleteLike(idPublicacion).subscribe({
        next: () => {
          post.likes = post.likes.filter(id => id !== this.idUsuarioLogueado);
        }
      });
    } else {
      // POST al backend para agregar like
      this.publicacionesService.addLike(idPublicacion).subscribe({
        next: () => {
          post.likes.push(this.idUsuarioLogueado);
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
      error: (err) => alert('No se pudo eliminar la publicación')
    });
  }
}
