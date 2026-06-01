import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({ timestamps: true })//guardo timestamp createdAt y updatedAt para menajer los posts
export class Usuario {
    @Prop({required:true})
    nombre!: string;

    @Prop({required:true})
    apellido!: string;

    @Prop({ required: true, unique: true, index: true })//no necesariamente tiene que ser unique si ingresa con user
    correo!: string;

    @Prop({ required: true, unique: true, index: true })
    usuario!: string;

    @Prop({required:true})
    contrasena!: string;

    @Prop({required:true})
    fechaNacimiento!: string;

    @Prop({required:true})
    descripcion!: string;

    @Prop({ required: false, default:''})
    foto!: string;

    @Prop({required:true, default:'usuario'})
    perfil!: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);//siempre voy a usar el schema para manejar la colección de usuarios, nunca el usuario en sí