import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class Usuario {
    @Prop({required:true})
    nombre!: string;

    @Prop({required:true})
    apellido!: string;

    @Prop({required:true})
    correo!: string;

    @Prop({required:true})
    usuario!: string;

    @Prop({required:true})
    contraseña!: string;

    @Prop({required:true})
    fechaNacimiento!: Date;

    @Prop({required:true})
    descripcion!: string;

    @Prop({required:true})
    foto!: string;

    @Prop({required:true, default:'usuario'})
    perfil!: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);//siempre voy a usar el schema para manejar la colección de usuarios, nunca el usuario en sí