import { BadRequestException, Injectable} from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { extname } from 'path'; // Funciona en Windows local y Vercel Linux)
import { createClient, SupabaseClient } from '@supabase/supabase-js';


@Injectable()
export class AuthService {
  private supabase: SupabaseClient;// uso el tipo específico de la instancia de Supabase

  constructor(private readonly usuariosService: UsuariosService) {
    // inicializa el cliente con las variables de entorno
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
  }

  // subo la foto a Supabase Storage
  async registrarUsuario(createUsuarioDto: any, file: Express.Multer.File) {
    const sufijoUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const nombreArchivo = `${sufijoUnico}${ext}`;

    // 1. Subir el buffer del archivo a Supabase Storage
    const { data, error } = await this.supabase.storage
      .from('perfiles') // Nombre de tu bucket
      .upload(`fotos/${nombreArchivo}`, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      throw new BadRequestException(`Error al subir la imagen: ${error.message}`);
    }

    // 2. Obtener la URL pública de la imagen alojada
    const { data: { publicUrl } } = this.supabase.storage
      .from('perfiles')
      .getPublicUrl(`fotos/${nombreArchivo}`);

    // 3. Persistir en MongoDB pasando la URL pública final
    return this.usuariosService.create({
      ...createUsuarioDto,
      foto: publicUrl 
    });

    //SPRINT 3 TOKEN JWT VA ACA
  }

  async loginUsuario(user: string, contrasena: string) {
    return this.usuariosService.login(user, contrasena);
  }
}