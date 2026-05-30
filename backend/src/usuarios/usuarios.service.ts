import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuariosModel: Model<Usuario>){}//traigo la colección de mongo, traigo el model de tipo Usuario. Este model se va a encargar de manejar la colección de usuario, como si fuera la conexión a la BD.

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioCreado = await this.usuariosModel.create(createUsuarioDto)//el modelo tiene todos los métodos que voy a usar para comunicarme con la BD.
    return usuarioCreado;
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: string) {
    return `This action returns a #${id} usuario`;
  }

  update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: string) {
    return `This action removes a #${id} usuario`;
  }
}
