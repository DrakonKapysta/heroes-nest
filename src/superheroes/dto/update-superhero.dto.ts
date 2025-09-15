import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateSuperheroDto } from './create-superhero.dto';
import { IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateSuperheroDto extends PartialType(CreateSuperheroDto) {
  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string' },
    description: 'List of removed image URLs',
    example: [
      'http://example.com/images/superhero1.jpg',
      'http://example.com/images/superhero2.jpg',
    ],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  })
  removedImages?: string[] = [];
}
