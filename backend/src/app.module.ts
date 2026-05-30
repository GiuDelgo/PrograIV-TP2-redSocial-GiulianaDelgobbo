import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';

@Module({
  imports: [
    ConfigModule.forRoot(), //config va antes que la conexión a atlas
    MongooseModule.forRoot(process.env.MONGO_URI_PROD!), AuthModule, UsuariosModule, PublicacionesModule //conexión a atlas
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {

}
