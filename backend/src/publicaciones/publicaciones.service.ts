import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { extname } from 'path'; 
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './entities/publicacion.entity';
import { exec } from 'child_process';


@Injectable()
export class PublicacionesService {
  private supabase: SupabaseClient;

  constructor(@InjectModel(Publicacion.name) private PublicacionModel: Model<Publicacion>) {
    this.supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
  }

  async create(createPublicacionDto: CreatePublicacionDto, file?: Express.Multer.File) {
    let publicUrl = '';
    
    if (file && file.buffer) {
      const sufijoUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const nombreArchivo = `${sufijoUnico}${ext}`;
    
      // subo el buffer del archivo a Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('publicaciones') // bucket donde voy a guardar las fotos
        .upload(`postFoto/${nombreArchivo}`, file.buffer, { 
          contentType: file.mimetype, 
          upsert: true //si el archivo no existe lo crea
        });

      if (error) {
        throw new BadRequestException(`Error al subir la imagen: ${error.message}`);
      }
    
      // obtengo la URL pública de la imagen alojada
      const res = this.supabase.storage
        .from('publicaciones')
        .getPublicUrl(`postFoto/${nombreArchivo}`);

      publicUrl = res.data.publicUrl;
    }

    // creo la instancia con Mongoose para forzar a que use los default declarados en el Schema
    const nuevaPublicacion = new this.PublicacionModel({
      titulo: createPublicacionDto.titulo,
      descripcion: createPublicacionDto.descripcion,
      usuarioId: createPublicacionDto.usuarioId,
      usuarioNombre: createPublicacionDto.usuarioNombre,
      urlImagen: publicUrl,
      likes: [],          
      comentarios: [],   
      eliminado: false    
    });

    // El return con await es fundamental en Vercel para que complete la persistencia física en Atlas
    return await nuevaPublicacion.save();
  }

  async findAll(usuarioNombre?: string, limiteNum?: number, offsetNum?: number, orden?: string,) {
    const filtro: any = {eliminado: false}; //creo objeto filtro para ir armandolo segun los parámetros que lleguen

    if (usuarioNombre){
      filtro.usuarioNombre = usuarioNombre;
    }

    if (orden === 'likes') {//chequeo si el orden es por likes
      const pipeline: any[] = [//array con la secuencia de operaciones que quiero que Mongo haga
        { $match: filtro }, //filtro para que solo se incluyan las publicaciones que no están eliminadas (match mongo = where SQL)
        { $addFields: { likesCount: { $size: '$likes' } } },//cuenta la cantidad de likes de la publicación. likesCount es un parametro temporal que guardará la cantidad
        { $sort: { likesCount: -1, createdAt: -1 } },//ordena por likes y luego por fecha de creación si hay que desempatar
      ];

      if (offsetNum !== undefined && !isNaN(offsetNum)) {
        pipeline.push({ $skip: offsetNum });
      }

      if (limiteNum && !isNaN(limiteNum)) {
        pipeline.push({ $limit: limiteNum });
      }

      return await this.PublicacionModel.aggregate(pipeline).exec();
    }

    let consulta = this.PublicacionModel.find(filtro).sort({ createdAt: -1 });

    if (offsetNum !== undefined && !isNaN(offsetNum)){
      consulta = consulta.skip(offsetNum);
    }

    if (limiteNum && !isNaN(limiteNum)) {
      consulta = consulta.limit(limiteNum);
    }

    return await consulta.exec();
  }

  async remove(id: string) {
    const publicacionEliminada = await this.PublicacionModel.findByIdAndUpdate(
      id, 
      { eliminado: true }, 
      { new: true } //devuelve el documento modificado
    ); 

    if (!publicacionEliminada) {
      throw new BadRequestException(`No se encontró la publicación`);
    }

    return { message: 'Publicación dada de baja correctamente', data: publicacionEliminada };  
  }
    
  async addLike(UpdatePublicacionDto: UpdatePublicacionDto, id: string) {
    const publicacionLikeada = await this.PublicacionModel.findByIdAndUpdate(
      id, 
      { $addToSet: { likes: UpdatePublicacionDto.usuarioId } }, //addToSet evita que se repitan valores, si el id ya está en el array no lo agrega
      { new: true } //devuelve el documento modificado
    ); 

    if (!publicacionLikeada) {
      throw new BadRequestException(`No se encontró la publicación`);
    }

    return { message: 'Publicación likeada', data: publicacionLikeada };  
  }

  async removeLike (id: string, usuarioId: string){
    const publicacionDesLikeada = await this.PublicacionModel.findByIdAndUpdate(
      id, 
      { $pull: { likes: usuarioId } }, 
      { new: true } //devuelve el documento modificado
    ); 

    if (!publicacionDesLikeada) {
      throw new BadRequestException(`No se encontró la publicación`);
    }

    return { message: 'Publicación deslikeada', data: publicacionDesLikeada };  
  }

  findOne(id: number) {
    return `This action returns a #${id} publicacion`;
  }

  update(id: number, updatePublicacionDto: UpdatePublicacionDto) {
    return `This action updates a #${id} publicacion`;
  }

  
}
