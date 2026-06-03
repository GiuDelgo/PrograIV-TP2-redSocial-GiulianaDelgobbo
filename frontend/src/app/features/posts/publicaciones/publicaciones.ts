import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../../shared/interfaces/publicacion.interface';
import { PublicacionCard } from '../publicacion-card/publicacion-card';
import { PublicacionesService } from '../../../core/services/publicaciones.service';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, PublicacionCard],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})

export class Publicaciones implements OnInit {
  // publicaciones: Publicacion[] = [];

  publicaciones: Publicacion[] = [
    {
      _id: 'pub_mock_001',
      titulo: 'Probando la comunicación de componentes',
      descripcion: 'Este es un post de prueba para verificar que la tarjeta hija renderice de forma correcta las propiedades de descripcion, usuarioNombre y fechaCreacion.',
      urlImagen: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      usuarioId: 'ID_DEL_TOKEN', // SPRINT 3: Reemplazar con lógica real de autenticación
      usuarioNombre: 'juanperez',
      fechaCreacion: '2026-06-03T14:30:00.000Z',
      likes: ['ID_DEL_TOKEN', 'user_id_externo_1'],
      comentarios: [
        {
          _id: 'com_mock_01',
          mensaje: 'hola hola',
          fecha: new Date(),
          usuario: {
            usuario: 'otro_user',
            foto: 'https://randomuser.me/api/portraits/men/32.jpg'
          }
        }
      ]
    }
  ];
  
  ordenActual: 'fecha' | 'likes' = 'fecha';
  limite: number = 5; // Cantidad limitada por página
  offset: number = 0; // Control de paginación
  totalPublicaciones: number = 0; // para deshabilitar botones de paginado

  idUsuarioLogueado: string = 'ID_DEL_TOKEN'; // SPRINT 3: Reemplazar con lógica real de autenticación

  constructor(private publicacionesService: PublicacionesService) {}

  ngOnInit() {
    // this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.publicacionesService.obtenerPublicaciones(this.ordenActual === 'fecha' ? 'fecha' : 'likes', this.limite, this.offset).subscribe({
      next: (res) => {
        this.publicaciones = res.data;
        this.totalPublicaciones = res.total;
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

  // paginación sin scroll infinito, solo botones "Siguiente" y "Anterior"
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
    // PATCH para baja lógica en NestJS
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
