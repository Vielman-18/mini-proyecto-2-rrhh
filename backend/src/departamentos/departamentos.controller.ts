import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param, 
    ParseIntPipe,
} from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { CrearDepartamentoDto } from './dto/crear-departamento.dto';

@Controller('departamentos')
export class DepartamentosController {
    constructor(private readonly departamentosService: DepartamentosService) {}


    @Post()
    crear(@Body() dto: CrearDepartamentoDto) {
        return this.departamentosService.crear(dto);
    }

    @Get()
    listar() {
        return this.departamentosService.Listar();
    }

    @Get(':id')
    buscarPorId(@Param('id', ParseIntPipe) id: number) {
        return this.departamentosService.buscarPorId(id);
    }

    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.departamentosService.eliminar(id);
    }

    @Put(':id/estado')
    cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body('estado') estado: string
    ) {
        return this.departamentosService.cambiarEstado(id, estado);
    }
}