import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Publicacion } from '../../../shared/interfaces/publicacion.interface';

@Component({
  selector: 'app-publicacion-comentarios-card',
  imports: [],
  templateUrl: './publicacion-comentarios-card.html',
  styleUrl: './publicacion-comentarios-card.css',
})
export class PublicacionComentariosCard {
  @Input({ required: true }) publicacion!: Publicacion;
  @Input({ required: true }) idUsuarioLogueado!: string;
  @Output() onClose = new EventEmitter<void>();

  // Al presionar la "X" o "Cerrar" en este componente, ejecutás esto:
  notificarCierre() {
    this.onClose.emit();
  }
}
