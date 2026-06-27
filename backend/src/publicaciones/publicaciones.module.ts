import { forwardRef, Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { ComentariosModule } from './comentarios/comentarios.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './entities/publicacion.entity';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  imports: [
    MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }]),
    forwardRef(() => ComentariosModule), //evito dependencia cirular, resuelve los módulos de forma diferida en tiempo de ejecución
  ],
  exports: [PublicacionesService]
})
export class PublicacionesModule {}
