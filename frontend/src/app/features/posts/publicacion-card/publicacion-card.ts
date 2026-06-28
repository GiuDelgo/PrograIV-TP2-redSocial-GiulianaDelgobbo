import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../../shared/interfaces/publicacion.interface';
import { AuthService } from '../../../core/services/auth.service';
import { Comentario } from '../../../shared/interfaces/comentario.interface';
import { TiempoAtrasPipe } from '../../../shared/pipes/tiempo-atras-pipe'; 
import { RecortarTextoPipe } from '../../../shared/pipes/recortar-texto-pipe';
import { InicialesPipe } from '../../../shared/pipes/iniciales-pipe';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule, TiempoAtrasPipe, RecortarTextoPipe, InicialesPipe],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.css'
})

export class PublicacionCard {
  @Input() publicacion!: Publicacion;
  @Input() idUsuarioLogueado: string = '';
  @Input() perfilUsuarioLogueado: string = '';

  @Output() onLike = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onComment = new EventEmitter<Publicacion>();

  comentarios = signal<Comentario[]>([]);

  message = signal<string | null>(null);
  isConfirmed = signal <boolean>(false);

  constructor (private authService : AuthService){}

  get isLiked(): boolean {
    return this.publicacion.likes.includes(this.idUsuarioLogueado);//busco el id del user loguado en el array de likes
  }

  get isMine(): boolean {
    return this.publicacion.usuarioId === this.idUsuarioLogueado;
  }

  get isAdmin():boolean{
    return this.perfilUsuarioLogueado === 'administrador';
  }

  toggleLike() {
    this.onLike.emit(this.publicacion._id);
  }

  confirmDelete(){
    this.isConfirmed.set(true);
    this.eliminarPost();
  }

  cancelDelete(){
    this.isConfirmed.set(false);
    this.message.set(null);
  }

  deleteMessage (){
    this.message.set('Seguro que desea eliminar la publicación?');
  }

  eliminarPost() {
    if (this.isConfirmed()) {
      this.onDelete.emit(this.publicacion._id);

      setTimeout( ()=>{
        this.isConfirmed.set(false);
        this.message.set(null);
      },
      2000);
    }
  }

  showPostComments(){
    //cambia un outPut booleano a true o false para que en publicaciones se muestre la publicacion grande
    this.onComment.emit(this.publicacion);
  }
}