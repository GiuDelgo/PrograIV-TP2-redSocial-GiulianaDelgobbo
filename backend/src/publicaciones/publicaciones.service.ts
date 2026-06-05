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
    try{
      let urlImagenFinal = '';
    
      if (file) {
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
        const { data: { publicUrl } } = this.supabase.storage
          .from('publicaciones')
          .getPublicUrl(`postFoto/${nombreArchivo}`);

        urlImagenFinal = publicUrl;
      
          // parsiste en MongoDB pasando la URL pública final
        return await this.PublicacionModel.create({...createPublicacionDto, urlImagen: urlImagenFinal });
    }

    } catch (mongoError: any){
      console.log(mongoError.message);
      throw new BadRequestException(`Error de persistencia en MongoDB: ${mongoError.message}`);
    }
  }

  async findAll(usuarioNombre?: string, limiteNum?: number, orden?: string,) {
    const filtro: any = {}; //creo objeto filtro para ir armandolo segun los parámetros que lleguen

    if (usuarioNombre){
      filtro.usuarioNombre = usuarioNombre;
    }

    let consulta = this.PublicacionModel.find(filtro);

    if (orden === 'likes'){
      consulta = consulta.sort({meGusta: -1});
    }else{
      consulta = consulta.sort({fechaCreacion: -1});
    }

    if (limiteNum) {
      consulta = consulta.limit(limiteNum);
    }

    return await consulta.exec();
  }


  findOne(id: number) {
    return `This action returns a #${id} publicacion`;
  }

  update(id: number, updatePublicacionDto: UpdatePublicacionDto) {
    return `This action updates a #${id} publicacion`;
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
}
