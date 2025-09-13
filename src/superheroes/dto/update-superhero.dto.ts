import { PartialType } from '@nestjs/swagger';
import { CreateSuperheroDto } from './create-superhero.dto';

export class UpdateSuperheroDto extends PartialType(CreateSuperheroDto) {}
