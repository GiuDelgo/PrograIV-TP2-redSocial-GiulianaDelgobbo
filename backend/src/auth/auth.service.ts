import { BadRequestException, Injectable} from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { SupabaseClient, createClient } from '@supabase/supabase-js/dist/index.mjs';
import { extname } from 'path/win32';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  // inyecto el modelo de usuarios dentro del contexto de auth
  constructor(private readonly usuariosService: UsuariosService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
  }

  async registrarUsuario(createUsuarioDto: CreateUsuarioDto, file: Express.Multer.File) {
    const sufijoUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const nombreArchivo = `${sufijoUnico}${ext}`;

    // subo la foto a Supabase Storage
    const { data, error } = await this.supabase.storage
      .from('perfiles')
      .upload(`fotos/${nombreArchivo}`, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new BadRequestException(`Error al subir la imagen: ${error.message}`);
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from('perfiles')
      .getPublicUrl(`fotos/${nombreArchivo}`);

    return this.usuariosService.create({
      ...createUsuarioDto,
      foto: publicUrl // guardo la URL pública de la foto en el perfil del usuario
    });

    //SPRINT 3 TOKEN JWT VA ACA
  }

  async loginUsuario(user: string, contrasena: string) {
    return this.usuariosService.login(user, contrasena);
  }
}