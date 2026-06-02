import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { memoryStorage } from 'multer';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @UseInterceptors(
    FileInterceptor('foto', { // interceptor para interceptar la petición antes de que llegue al método. FileInterceptor es el que se usa para multipart/form-data (subida de archivos). 'foto' es el nombre del campo del formulario de donde viene el archivo
      storage: memoryStorage(),//guarda el archivo temporalemente en memoria para luego procesarlo y guardarlo en el destino final
      fileFilter: (req, file, callback) => {//valido si el archivo cumple con las condiciones antes de guardarlo
        // validación  de tipo de archivo
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png)'), false);
        }
        callback(null, true);//si pasa el filtro devuelve true
      },
    }),
  )

  async registro(
    @Body() createUsuarioDto: CreateUsuarioDto, //capturo body y lo paso al dto
    @UploadedFile() file: Express.Multer.File, //capturo archivo y accedo a sus metadatos
  ) {
    if (!file) {
      throw new BadRequestException('La foto de perfil es obligatoria para el registro');
    }
    return this.authService.registrarUsuario(createUsuarioDto, file);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) { 
    return this.authService.loginUsuario(loginDto.usuario, loginDto.contrasena);
  }
}