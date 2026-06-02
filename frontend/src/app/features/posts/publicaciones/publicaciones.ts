import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Publicacion } from '../interfaces/publicacion.interface';
import { PublicacionCard } from '../publicacion-card/publicacion-card';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, PublicacionCard],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class Publicaciones implements OnInit {
  publicaciones: Publicacion[] = [];
  
  // Parámetros obligatorios de Cátedra
  ordenActual: 'fecha' | 'likes' = 'fecha';
  limite: number = 5; // Cantidad limitada por página
  offset: number = 0; // Control de paginación
  totalPublicaciones: number = 0; // Útil para deshabilitar botones de paginado

  idUsuarioLogueado: string = 'ID_DEL_TOKEN'; // Obtener de tu AuthService real

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    // Pegada al backend dinámico en NestJS mapeando los query params acordados
    const url = `https://tu-api.com/publicaciones?orden=${this.ordenActual}&limit=${this.limite}&offset=${this.offset}`;
    
    this.http.get<{ data: Publicacion[], total: number }>(url).subscribe({
      next: (res) => {
        this.publicaciones = res.data;
        this.totalPublicaciones = res.total;
      },
      error: (err) => console.error('Error al traer posteos:', err)
    });
  }

  cambiarOrden(nuevoOrden: 'fecha' | 'likes') {
    if (this.ordenActual !== nuevoOrden) {
      this.ordenActual = nuevoOrden;
      this.offset = 0; // Reinicio paginación al reordenar
      this.cargarPublicaciones();
    }
  }

  // Lógica de Paginación Tradicional del Sprint #2
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

    const yaTieneLike = post.likes.includes(this.idUsuarioLogueado);
    
    if (yaTieneLike) {
      // DELETE al backend para remover like
      this.http.delete(`https://tu-api.com/publicaciones/${idPublicacion}/like`).subscribe({
        next: () => {
          post.likes = post.likes.filter(id => id !== this.idUsuarioLogueado);
        }
      });
    } else {
      // POST al backend para agregar like
      this.http.post(`https://tu-api.com/publicaciones/${idPublicacion}/like`, {}).subscribe({
        next: () => {
          post.likes.push(this.idUsuarioLogueado);
        }
      });
    }
  }

  handleDelete(idPublicacion: string) {
    // DELETE para baja lógica en NestJS
    this.http.delete(`https://tu-api.com/publicaciones/${idPublicacion}`).subscribe({
      next: () => {
        // Quitamos del arreglo visual local
        this.publicaciones = this.publicaciones.filter(p => p._id !== idPublicacion);
        this.totalPublicaciones--;
      },
      error: (err) => alert('No se pudo eliminar la publicación')
    });
  }
}
