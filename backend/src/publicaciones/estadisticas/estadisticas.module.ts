import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { PublicacionesService } from '../publicaciones.service';

@Module({
  controllers: [EstadisticasController],
  providers: [EstadisticasService, PublicacionesService],
})
export class EstadisticasModule {}
