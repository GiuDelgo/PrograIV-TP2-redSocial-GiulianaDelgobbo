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
  @UseInterceptors( //los interceptores forman parte de la capa HTTP de NestJS y se ejecutan sobre rutas controladas por un Controller
    FileInterceptor('foto', { // interceptor para interceptar la petición antes de que llegue al método. FileInterceptor es el que se usa para multipart/form-data (subida de archivos)
      storage: memoryStorage(),//guarda el archivo temporalemente en memoria para luego procesarlo y guardarlo en el destino final ->multer
      fileFilter: (req, file, callback) => {//valido si el archivo cumple con las condiciones antes de guardarlo ->multer
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png)'), false);
        }
        callback(null, true);//si pasa el filtro devuelve true
      },
    }),
  )

  async registro(
    @Body() createUsuarioDto: CreateUsuarioDto, //capturo body y lo paso al dto ->JSON
    @UploadedFile() file: Express.Multer.File, //capturo archivo y accedo a sus metadatos ->multipart/form-data
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

//file:{
//  fieldname: 'foto',
//  originalname: 'foto.jpg',
//  encoding: '7-bit',
//  mimetype: 'image/jpeg',
//  buffer: <Buffer ...>,
//  size: 12345
//}