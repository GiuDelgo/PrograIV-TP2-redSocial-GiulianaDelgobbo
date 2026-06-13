import { BadRequestException, Injectable} from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { extname } from 'path'; // Funciona en Windows local y Vercel Linux)
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { access } from 'fs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService
  ) {
    // inicializa el cliente con las variables de entorno
    this.supabase = createClient(process.env.SUPABASE_URL!,process.env.SUPABASE_KEY!);
  }

  // subo la foto a Supabase Storage y el usuario a MongoDB con la URL pública de la foto
  async registrarUsuario(createUsuarioDto: CreateUsuarioDto, file: Express.Multer.File) {
    const sufijoUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);//0 a 1.000.000.000 
    const ext = extname(file.originalname);//me quedo con la extensión del archivo original para que se guarde con el formato correcto (jpg, png, etc) 
    const nombreArchivo = `${sufijoUnico}${ext}`;

    // subo el buffer del archivo a Supabase Storage
    const { data, error } = await this.supabase.storage
      .from('perfiles') // bucket donde voy a guardar las fotos
      .upload(`fotos/${nombreArchivo}`, file.buffer, { //subo el archivo de la foto
        contentType: file.mimetype, //image/jpeg, image/png, etc, para que el navegador sepa cómo mostrar la imagen
        upsert: true //si el archivo no existe lo crea, si ya existe lo reemplaza 
      });

    if (error) {
      throw new BadRequestException(`Error al subir la imagen: ${error.message}`);
    }

    // obtengo la URL pública de la imagen alojada
    const { data: { publicUrl } } = this.supabase.storage
      .from('perfiles')
      .getPublicUrl(`fotos/${nombreArchivo}`);

    // persiste en MongoDB pasando la URL pública final
    const nuevoUsuario = await this.usuariosService.create({
      ...createUsuarioDto,
      foto: publicUrl 
    });

    if (!nuevoUsuario) {
      throw new Error('Error al crear el usuario');
    }

    const token = await this.generateJWT(nuevoUsuario);

    return {token, usuario: nuevoUsuario};
  }

  async loginUsuario(user: string, contrasena: string) {
    const loginUsuario = await this.usuariosService.login(user, contrasena);

    if (!loginUsuario) {
      throw new Error('Error al crear el usuario');
    }

    const token = await this.generateJWT(loginUsuario);

    return { token, usuario: loginUsuario};
  }

  async generateJWT(usuario:any){
    const payload = {
      sub: usuario._id,      
      usuario: usuario.usuario,
      correo: usuario.correo,
      perfil: usuario.perfil
    };

    return {access_token: await this.jwtService.signAsync(payload)};
  }


}