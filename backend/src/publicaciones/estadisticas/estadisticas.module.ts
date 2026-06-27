import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { PublicacionesModule } from '../publicaciones.module';
import { ComentariosModule } from '../comentarios/comentarios.module';


@Module({
  imports: [ PublicacionesModule, ComentariosModule ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}
