import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {Usuario, UsuarioSchema} from './entities/usuario.entity'

@Module({
  //forFeature indica que importo mongooseModule sólo para el módulo usuarios
  imports:[MongooseModule.forFeature([{name: Usuario.name, schema: UsuarioSchema}])],//disponibilizo el schema de usuario dentro del módulo usuarios
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule {}
