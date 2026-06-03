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
    const { contrasena:_c, ...userObject } = guardado.toObject();
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

    return {
      mensaje: 'Login exitoso',
      usuario: respuestaUsuario,      
      // ***REMINDER*** en el Sprint #3 aca  es donde firmo el Token JWT con vigencia de 15 min
    }
  }

  async findUsername(username: string) {
    const usuario = await this.usuarioModel.findOne({ usuario: username });

    if (!usuario) {
      return null;
    }

    const { contrasena, ...userResponse } = usuario.toObject();
    return userResponse;
  }

  findOne(id: string){
    return `This action returns all usuarios`;
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: string) {
    return `This action removes a #${id} usuario`;
  }
}
