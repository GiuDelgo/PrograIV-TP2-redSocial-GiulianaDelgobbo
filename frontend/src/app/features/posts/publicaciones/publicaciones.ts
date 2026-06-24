import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../../shared/interfaces/publicacion.interface';
import { PublicacionCard } from '../publicacion-card/publicacion-card';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule} from '@angular/forms';
import { PublicacionComentariosCard } from '../publicacion-comentarios-card/publicacion-comentarios-card';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, PublicacionCard, FormsModule, PublicacionComentariosCard],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})

export class Publicaciones implements OnInit, OnDestroy {
  publicaciones = signal<Publicacion[]>([]);
  
  errorMessage = signal<string | null>(null);

  ordenActual: 'createdAt' | 'likes' = 'createdAt';
  limite: number = 5; 
  offset: number = 0; 
  totalPublicaciones: number = 0; // para deshabilitar botones de paginado
  usuarioId = ''; 
  usuarioPerfil = '';

  usuarioFilter = '';
  filtroActivo = false;

  publicacionComentarios = signal<Publicacion | null>(null);

  private postSub!: Subscription;

  constructor(private publicacionesService: PublicacionesService, private authService: AuthService) {
  }

  ngOnInit() {
    this.cargarPublicaciones();

    const usuarioSesion = this.authService.usuarioActual();

    if (usuarioSesion){
      this.usuarioId = usuarioSesion._id;
      this.usuarioPerfil = usuarioSesion.perfil;
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
    const usuarioNombre = this.filtroActivo && this.usuarioFilter.trim() ? this.usuarioFilter.trim(): undefined;//para la petición al backend con filtro de usuario

    this.publicacionesService.obtenerPublicaciones(this.ordenActual, this.limite, this.offset, usuarioNombre).subscribe({
      next: (res) => {

        this.publicaciones.set(res);

        if (res.length === this.limite){//traigo de a 5 pubs, si me devuelve 5, puede haber mas, sino llegue al límite
          this.totalPublicaciones = this.offset + res.length + 1;
        } else{
          this.totalPublicaciones = this.offset + res.length;
        }

        this.errorMessage.set(null);
      },
      error: (err) => {
        const mensajeError = err.error?.message || 'Error al cargar publicaciones';
        this.errorMessage.set(mensajeError)
      }
    });
  }

  cambiarOrden(nuevoOrden: 'createdAt' | 'likes') {
    if (this.ordenActual !== nuevoOrden) {
      this.ordenActual = nuevoOrden;
      this.offset = 0; // Reinicio paginación al reordenar
      this.cargarPublicaciones();
    }
  }

  filtrarUsuario() {
    const notEmptyUsername = this.usuarioFilter.trim();
    if (!notEmptyUsername) {
      this.borrarBusqueda();
      return;
    }

    this.usuarioFilter = notEmptyUsername;
    this.filtroActivo = true;
    this.offset = 0;
    this.cargarPublicaciones();
  }

  borrarBusqueda() {
    this.usuarioFilter = '';
    this.filtroActivo = false;
    this.offset = 0;
    this.cargarPublicaciones();
  }

  // paginación 
  paginaSiguiente() {
    this.offset += this.limite;
    this.cargarPublicaciones();
  }

  paginaAnterior() {
    if (this.offset - this.limite >= 0) {
      this.offset -= this.limite;
      this.cargarPublicaciones();
    }
  }

  handleLike(idPublicacion: string) {
    const post = this.publicaciones().find(p => p._id === idPublicacion);
    if (!post) return;

    const isLiked = post.likes.includes(this.usuarioId);
    
    if (isLiked) {
      // DELETE al backend para remover like
      this.publicacionesService.deleteLike(idPublicacion, this.usuarioId).subscribe({
        next: () => {
          post.likes = post.likes.filter(id => id !== this.usuarioId);
          this.publicaciones.set([...this.publicaciones()]);
        }
      });
    } else {
      // POST al backend para agregar like
      this.publicacionesService.addLike(idPublicacion, this.usuarioId).subscribe({
        next: () => {
          post.likes.push(this.usuarioId);
          this.publicaciones.set([...this.publicaciones()]);
        }
      });
    }
  }

  handleDelete(idPublicacion: string) {
    this.publicacionesService.deletePublicacion(idPublicacion).subscribe({
      next: () => {
        this.publicaciones.set(this.publicaciones().filter(p => p._id !== idPublicacion));//una vez que el metodo hizo el borrado lógico, saco del signal de array a la publicacion eliminada
        this.totalPublicaciones--;//resto uno al contador
      },
      error: (err) => {
        const mensajeError = err.error?.message || 'No se pudo eliminar la publicación';
        this.errorMessage.set(mensajeError)
      }
    });
  }

  handleCommentSection(showPostComments: Publicacion){
    this.publicacionComentarios.set(showPostComments);
  }

  cerrarComentarios() {
  this.publicacionComentarios.set(null);
}
}
