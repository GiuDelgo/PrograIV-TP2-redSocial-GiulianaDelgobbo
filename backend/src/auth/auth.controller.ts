import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException, Res, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { memoryStorage } from 'multer';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { AuthGuard } from '../guards/auth/auth.guard';

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
    @Res({passthrough: true}) res: Response //se usa para modificar la respuesta que nest está preparando y que le agregue la cookie con el token y el mensaje exitoso
  )  {

    if (!file) {
      throw new BadRequestException('La foto de perfil es obligatoria para el registro');
    }

    const { token, usuario } = await this.authService.registrarUsuario(createUsuarioDto, file);

    this.setTokenCookie(res, token.access_token);

    return usuario ;
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({passthrough: true}) res: Response
  ) { 
    const { token, usuario } = await this.authService.loginUsuario(loginDto.usuario, loginDto.contrasena);

    this.setTokenCookie(res, token.access_token);

    return usuario;
  }


  @Post('autorizar')
  @UseGuards(AuthGuard)
  async validateJwt(@Req() req: Request){
    // si el guard permite el paso, significa que el token es 100% válido.
    // retorna directamente los datos del usuario que el Guard extrajo del payload.
    return req['user'];
  }

  @Post('refrescar')
  @UseGuards(AuthGuard)
  async refreshJwt(
    @Req() req: Request, 
    @Res({ passthrough: true }) res: Response
  ){
    // extraigo el payload que el Guard decodificó e inyectó en la request
    const usuarioValidado = req['user'];

    const usuarioFormateado = {
      _id: usuarioValidado.sub, // 'sub' de vuelta a '_id'
      usuario: usuarioValidado.usuario,
      correo: usuarioValidado.correo,
      perfil: usuarioValidado.perfil
    };

    // le pido al servicio que genere un nuevo access_token con el mismo payload
    const resultado = await this.authService.generateJWT(usuarioFormateado);

    // pisa la cookie vieja con el nuevo token renovado por 15 minutos más
    this.setTokenCookie(res, resultado.access_token);

    return { message: 'Token renovado exitosamente' };
  }

  //método para configuración de cookie
  private setTokenCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true, 
      sameSite: 'strict',
      secure: true, 
      maxAge: 1000 * 60 * 15, // Sincronizacion de 15m con la exp del JWT token
    });
  }
}
