import { forwardRef, Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { PublicacionesModule } from '../publicaciones.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from './entities/comentario.entity';

@Module({
  controllers: [ComentariosController],
  providers: [ComentariosService],
  imports: [
    MongooseModule.forFeature([{ name: Comentario.name, schema: ComentarioSchema }]),
    forwardRef(() => PublicacionesModule)],//forwardRef evite el bloqueo por dependencia circular entre publicaciones y comentarios
  exports: [ComentariosService]
})
export class ComentariosModule {}
