import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @UseInterceptors(
    FileInterceptor('foto', { // interceptor para interceptar la petición antes de que llegue al método. FileInterceptor es el que se usa para multipart/form-data (subida de archivos). 'foto' es el nombre del campo del formulario de donde viene el archivo
      storage: diskStorage({//diskStorage guarda el archivo en el disco duro del servidor
        destination: process.env.NODE_ENV === 'production' ? '/tmp' : './uploads/perfiles', // carpeta donde se guardan las fotos producción vs local
        filename: (req, file, callback) => {//función que renombra archivos
          // nombre único para evitar colisiones de archivos
          const sufijoUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${sufijoUnico}${ext}`);
        },
      }),
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
    @Body() createUsuarioDto: CreateUsuarioDto, //capturo body y paso al dto
    @UploadedFile() file: Express.Multer.File, //capturo archivo y accedo a sus metadatos
  ) {
    if (!file) {
      throw new BadRequestException('La foto de perfil es obligatoria para el registro');
    }

    // paso el DTO y el path del archivo guardado al servicio
    const urlFoto = `/uploads/perfiles/${file.filename}`;
    return this.authService.registrarUsuario(createUsuarioDto, urlFoto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) { 
    return this.authService.loginUsuario(loginDto.usuario, loginDto.contrasena);
  }
}