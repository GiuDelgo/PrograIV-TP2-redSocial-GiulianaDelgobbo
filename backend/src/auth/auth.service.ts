import { BadRequestException, Injectable} from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { extname } from 'path/win32';

@Injectable()
export class AuthService {
  private supabase: any; // uso any porque el tipo se cargará dinámicamente

  // inyecto el modelo de usuarios dentro del contexto de auth
  constructor(private readonly usuariosService: UsuariosService) {
    // llamo a la inicialización dinámica al instanciar el servicio
    this.initSupabase();
  }

  // método asíncrono para solucionar el conflicto de ESM vs CommonJS en Vercel
  async initSupabase() {
    if (!this.supabase) {
      // dynamic import sugerido por el error de Vercel
      const { createClient } = await import('@supabase/supabase-js');
      
      this.supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!
      );
    }
  }

  async registrarUsuario(createUsuarioDto: CreateUsuarioDto, file: Express.Multer.File) {
    // aseguro de que Supabase esté completamente cargado antes de usarlo
    await this.initSupabase();

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