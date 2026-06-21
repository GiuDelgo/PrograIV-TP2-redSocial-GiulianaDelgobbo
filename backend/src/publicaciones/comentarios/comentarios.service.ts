import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { Model } from 'mongoose';
import { Comentario } from './entities/comentario.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PublicacionesService } from '../publicaciones.service';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name) 
    private ComentarioModel: Model<Comentario>, 
    @Inject(forwardRef(() => PublicacionesService))
    private readonly publicacionesService: PublicacionesService
  ) {}

  async create(createComentarioDto: CreateComentarioDto) {
    //1. guardar el comentario con su id en el schema de comentarios de mongoose
    //2. quiero ir a buscar el id de la publicacion a la base //AGREGAR EL MÉTODO EN EL SERVICIO DE PUBLICACIONES
    //3. agregarle al array de comentarios el id del comentario

    const comentario = new this.ComentarioModel({
      publicacionId: createComentarioDto.publicacionId,
      usuarioId: createComentarioDto.usuarioId,
      usuarioNombre: createComentarioDto.usuarioNombre,
      descripcion: createComentarioDto.descripcion
    });

    const comentarioGuardado = await comentario.save();
    await this.publicacionesService.guardarComentario(comentarioGuardado.publicacionId, comentarioGuardado._id.toString());//guardo el comentario en la publicación correspondiente

    return comentarioGuardado;
  }

  async update(id: string, updateComentarioDto: UpdateComentarioDto) {
    const comentarioEditado = await this.ComentarioModel.findByIdAndUpdate(
      id, 
      { 
        descripcion: updateComentarioDto.descripcion,
        editado: true 
      }, 
      { new: true } //devuelve el documento modificado
    ); 

    if (!comentarioEditado) {
      throw new NotFoundException(`No se encontró el comentario`);
    }

    return comentarioEditado;
  }

  async getComentarios(publicacionId: string, limit: number, offset: number){
    let query = this.ComentarioModel.find({ publicacionId })
    .sort({ createdAt: -1});

    if (offset !== undefined) {
      query = query.skip(offset);
    }

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    return query.exec();
  }
}

  
