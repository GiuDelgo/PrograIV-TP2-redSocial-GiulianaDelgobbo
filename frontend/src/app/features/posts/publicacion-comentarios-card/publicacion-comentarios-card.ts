import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Publicacion } from '../../../shared/interfaces/publicacion.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ComentariosService } from '../../../core/services/comentarios.service';
import { Comentario } from '../../../shared/interfaces/comentario.interface'

@Component({
  selector: 'app-publicacion-comentarios-card',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publicacion-comentarios-card.html',
  styleUrl: './publicacion-comentarios-card.css',
})
export class PublicacionComentariosCard {
  @Input({ required: true }) publicacion!: Publicacion;
  @Input({ required: true }) idUsuarioLogueado!: string;
  @Output() onClose = new EventEmitter<void>();

  comentForm!: FormGroup;

  usuarioString = localStorage.getItem('usuario_sesion');
  usuarioId = '';
  usuarioNombre = '';

  comentarios = signal<Comentario[]>([]);
  limite: number = 5; 
  offset: number = 0;
  totalComentarios: number = 0;

  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private comentariosService: ComentariosService){}

  ngOnInit() {
    this.cargarComent();

    this.comentForm = this.fb.group({
      comentario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
    });

    if (this.usuarioString !== null){
      const usuario = JSON.parse(this.usuarioString);            
      this.usuarioId = usuario._id;
      this.usuarioNombre = usuario.nombre;
    }
  }
  // Al presionar la "X" o "Cerrar" en este componente, ejecutás esto:
  notificarCierre() {
    this.onClose.emit();
  }

  enviarComent(){
    if (this.comentForm.invalid) {
      this.comentForm.markAllAsTouched();
      return;
    }

    const { comentario } = this.comentForm.value;

    this.comentariosService.comentarPublicacion(this.publicacion._id, this.usuarioId, this.usuarioNombre, comentario)
      .subscribe({
        next: () => {
          this.comentForm.reset(); //reseto el formgroup para limpiar los campos de texto
        },
        error: (err) => {
          const mensajeError = 'Hubo un error al subir el comentario. Intentalo de nuevo.';
          console.log(err.error?.message);
        }
      });
  }

  cargarComent(){
    this.comentariosService.obtenerComentarios(this.publicacion._id, this.limite, this.offset).subscribe({
      next: (res) => {

        this.comentarios.set(res);

        if (res.length === this.limite){//traigo de a 5 pubs, si me devuelve 5, puede haber mas, sino llegue al límite
          this.totalComentarios = this.offset + res.length + 1;
        } else{
          this.totalComentarios = this.offset + res.length;
        }

        this.errorMessage.set(null);
      },
      error: (err) => {
        const mensajeError = err.error?.message || 'Error al cargar comentarios';
        this.errorMessage.set(mensajeError)
      }
    });
  }
}
