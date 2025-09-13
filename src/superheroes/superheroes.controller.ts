import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetSuperheroesQueryDto } from './dto/get-superheroes-query.dto';
import {
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { SuperheroesService } from './superheroes.service';

@Controller('superheroes')
export class SuperheroesController {
  constructor(private readonly superheroesService: SuperheroesService) {}

  @ApiOperation({ summary: 'Get all superheroes with optional filters' })
  @ApiResponse({ status: 200, description: 'List of superheroes' })
  @Get()
  async getAllSuperheroes(@Query() query: GetSuperheroesQueryDto) {
    return this.superheroesService.findAll(query);
  }

  @ApiOperation({ summary: 'Create a new superhero' })
  @ApiResponse({ status: 201, description: 'Superhero created successfully' })
  @ApiConflictResponse({
    description: 'A superhero with the given nickname already exists.',
    example: {
      statusCode: 409,
      message: 'Hero with such nickname is already exists',
      error: 'Conflict',
    },
  })
  @Post('create')
  async createSuperhero(@Body() superhero: CreateSuperheroDto) {
    return this.superheroesService.create(superhero);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a superhero by ID' })
  @ApiResponse({ status: 200, description: 'Superhero deleted successfully' })
  async deleteSuperhero(@Param('id') id: string) {
    return this.superheroesService.remove(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a superhero by ID' })
  @ApiResponse({ status: 200, description: 'Superhero updated successfully' })
  async updateSuperhero(
    @Param('id') id: string,
    @Body() superhero: UpdateSuperheroDto,
  ) {
    return this.superheroesService.update(id, superhero);
  }

  @ApiOperation({ summary: 'Get a superhero by ID' })
  @ApiResponse({ status: 200, description: 'Superhero details' })
  @Get(':id')
  async getSuperheroById(id: string) {
    return this.superheroesService.findOne(id);
  }
}
