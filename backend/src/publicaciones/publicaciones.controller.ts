import { Controller, Get, Post, Body, Patch, Param, Query, Delete, UseInterceptors, BadRequestException, UploadedFile, UnsupportedMediaTypeException } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors( 
    FileInterceptor('foto', { 
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png)'), false);
        }
        callback(null, true);
      },
    }),
  )
  
  async create(@Body() createPublicacion: CreatePublicacionDto, @UploadedFile() file?: Express.Multer.File) {
    return this.publicacionesService.create(createPublicacion, file);
  }

  @Get()
  findAll(
    @Query('usuarioNombre') usuarioNombre?: string,
    @Query ('limite') limite?: string, 
    @Query('offset') offset?: string,
    @Query ('orden') orden?: string, 
  ) {

    const limiteNum = limite ? parseInt(limite, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;

    return this.publicacionesService.findAll(usuarioNombre, limiteNum, offsetNum, orden);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicacionesService.remove(id);
  }

  @Post(':id/like')
  addLike (
    @Param('id') id: string,
    @Body() UpdatePublicacionDto: UpdatePublicacionDto) {
    return this.publicacionesService.addLike(UpdatePublicacionDto, id);
  }

  @Delete(':id/like')
  removeLike (
    @Param('id') id: string,
    @Body() UpdatePublicacionDto: UpdatePublicacionDto
  ) {
    return this.publicacionesService.removeLike(UpdatePublicacionDto, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicacionDto: UpdatePublicacionDto) {
    return this.publicacionesService.update(+id, updatePublicacionDto);
  }

}
