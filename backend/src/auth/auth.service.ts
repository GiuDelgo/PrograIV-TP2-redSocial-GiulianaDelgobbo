import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  // inyecto el modelo de usuarios dentro del contexto de auth
  constructor(private readonly usuariosService: UsuariosService) {}

  async registrarUsuario(createUsuarioDto: CreateUsuarioDto, pathFoto: string) {
    return this.usuariosService.create({ ...createUsuarioDto, foto: pathFoto});
  }

  async loginUsuario(user: string, contrasena: string) {
    return this.usuariosService.login(user, contrasena);
  }
}