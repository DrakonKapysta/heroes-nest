import { Module } from '@nestjs/common';
import { SuperheroesService } from './superheroes.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SuperheroesService],
})
export class SuperheroesModule {}
