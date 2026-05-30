import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { ComentariosModule } from './comentarios/comentarios.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  imports: [ComentariosModule, EstadisticasModule],
})
export class PublicacionesModule {}
