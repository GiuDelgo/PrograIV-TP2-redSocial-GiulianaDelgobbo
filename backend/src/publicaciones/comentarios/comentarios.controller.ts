import { Controller, Get, Post, Body, Put, Param, Query } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  create(
    @Body() createComentarioDto: CreateComentarioDto
  ) {
    return this.comentariosService.create(createComentarioDto);
  }

  @Put(':comentId')
  update(@Param('comentId') id: string, @Body() updateComentarioDto: UpdateComentarioDto) {
    return this.comentariosService.update(id, updateComentarioDto);
  }

  @Get('publicacion/:publicacionId')
  getComentarios(
    @Param('publicacionId') publicacionId: string,
    @Query('limit') limit?: string,  // NestJS recibe los query params como string
    @Query('offset') offset?: string
  ){
    const limiteNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;

    return this.comentariosService.getComentarios(
      publicacionId, 
      Number(limit), 
      Number(offset)
    );
  }
}
