import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetSuperheroesQueryDto } from './dto/get-superheroes-query.dto';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { SuperheroesService } from './superheroes.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'heroImages', maxCount: 10 }]),
  )
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createSuperhero(
    @UploadedFiles() files: { heroImages?: Express.Multer.File[] },
    @Body() superhero: CreateSuperheroDto,
  ) {
    return this.superheroesService.create(superhero, files.heroImages);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a superhero by ID' })
  @ApiResponse({ status: 200, description: 'Superhero deleted successfully' })
  @UseGuards(JwtAuthGuard)
  async deleteSuperhero(@Param('id') id: string) {
    return this.superheroesService.remove(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a superhero by ID' })
  @ApiResponse({ status: 200, description: 'Superhero updated successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'heroImages', maxCount: 10 }]),
  )
  @UseGuards(JwtAuthGuard)
  async updateSuperhero(
    @Param('id') id: string,
    @UploadedFiles() files: { heroImages?: Express.Multer.File[] },
    @Body() superhero: UpdateSuperheroDto,
  ) {
    return this.superheroesService.update(id, superhero, files.heroImages);
  }

  @ApiOperation({ summary: 'Get a superhero by ID' })
  @ApiResponse({ status: 200, description: 'Superhero details' })
  @Get(':id')
  async getSuperheroById(@Param('id') id: string) {
    return this.superheroesService.findOne(id);
  }
}
