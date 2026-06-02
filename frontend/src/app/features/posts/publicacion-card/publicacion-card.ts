import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../interfaces/publicacion.interface';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.css'
})

export class PublicacionCard {
  @Input() publicacion!: Publicacion;
  @Input() idUsuarioLogueado: string = 'ID_DEL_TOKEN_LOCAL'; // Se extrae del JWT local

  @Output() onLike = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();

  get isLiked(): boolean {
    return this.publicacion.likes.includes(this.idUsuarioLogueado);
  }

  get isMine(): boolean {
    return this.publicacion.usuarioId === this.idUsuarioLogueado;
  }

  toggleLike() {
    this.onLike.emit(this.publicacion._id);
  }

  eliminarPost() {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      this.onDelete.emit(this.publicacion._id);
    }
  }
}