import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PublicacionesService } from '../publicaciones.service';
import { ComentariosService } from '../comentarios/comentarios.service';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { RoleGuard } from '../../guards/role/role.guard';

@Controller('admin/estadisticas')
@UseGuards(AuthGuard, RoleGuard) //protejo de forma global porque todas son rutas protegidas para admin

export class EstadisticasController {
  constructor(private readonly publicacionesService: PublicacionesService, private readonly comentariosService: ComentariosService) {}

  @Get('publicaciones-por-usuario')
  async getPostsUsuario(@Query('desde') desde: string, @Query('hasta') hasta: string) {
    return this.publicacionesService.countByUsuarioInTime(new Date(desde), new Date(hasta));
  }

  @Get('comentarios-totales')
  async getComentariosTotales(@Query('desde') desde: string, @Query('hasta') hasta: string) {
    return this.comentariosService.countTotalesInTime(new Date(desde), new Date(hasta));
  }

  @Get('comentarios-por-publicacion')
  async getComentariosPost(@Query('desde') desde: string, @Query('hasta') hasta: string) {
    return this.comentariosService.countPorPublicacionInTime(new Date(desde), new Date(hasta));
  }
}