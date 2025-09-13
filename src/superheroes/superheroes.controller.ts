import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('superheroes')
export class SuperheroesController {
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return 'all superheroes';
  }
}
