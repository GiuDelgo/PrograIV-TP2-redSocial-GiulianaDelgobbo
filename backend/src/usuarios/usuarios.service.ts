import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>){}//traigo la colección de mongo, traigo el model de tipo Usuario. Este model se va a encargar de manejar la colección de usuario, como si fuera la conexión a la BD.

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { usuario, contrasena } = createUsuarioDto;

    const existeUsuario = await this.usuarioModel.findOne({ usuario });

    if (existeUsuario) {
      throw new BadRequestException('Usuario ya registrado');
    }

    // encripto la contraseña con bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // creo el registro con la contraseña hasheada y el perfil usuario
    const nuevoUsuario = new this.usuarioModel({
      ...createUsuarioDto,
      contrasena: hashedPassword,
      perfil: 'usuario', // asigno por defecto 
    });

    const guardado = await nuevoUsuario.save();
    
    // oculto la contraseña en la respuesta por seguridad
    const { contrasena:_ctrs, ...userObject } = guardado.toObject(); //spread operator vs rest operator //paso el obj de mongoose a objeto plano js
    return userObject;
  }

  async login(usuario:string, contrasenaLogin: string) {
    // busco al usuario por username
    const usuarioEncontrado = await this.usuarioModel.findOne(
      { usuario }
    );

    if (!usuarioEncontrado) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // verifico si la contraseña coincide usando bcrypt.compare()
    const passwordMatch = await bcrypt.compare(contrasenaLogin, usuarioEncontrado.contrasena);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // devuelve los datos del usuario en el login público
    const { contrasena, ...respuestaUsuario } = usuarioEncontrado.toObject();

    return respuestaUsuario;    
  }

  async findUsername(username: string) {
    const usuario = await this.usuarioModel.findOne({ usuario: username });

    if (!usuario) {
      return null;
    }

    const { contrasena, ...userResponse } = usuario.toObject();
    return userResponse;
  }

  
  async findAll() {
    const usuarios = await this.usuarioModel.find({}).select('-contrasena');

    if (!usuarios || usuarios.length === 0) {
    return []; 
    }

    return usuarios;
  }

  async remove(id: string) {
    const usuarioEliminado = await this.usuarioModel.findByIdAndUpdate(
      id, 
      { eliminado: true }, 
      { new: true } //devuelve el documento modificado
    ); 

    return usuarioEliminado;
  }

  async altaUsuario (id: string){
    const usuarioAlta = await this.usuarioModel.findByIdAndUpdate(
      id, 
      { eliminado: false }, 
      { new: true } //devuelve el documento modificado
    ); 

    return usuarioAlta;
  }

}
