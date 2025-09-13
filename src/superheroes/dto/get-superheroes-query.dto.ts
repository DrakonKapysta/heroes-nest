import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Superpower } from '../enum/superpowers.enum';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetSuperheroesQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 5;

  @ApiPropertyOptional({
    description: 'Search term to filter superheroes by name',
    example: 'Batman',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by superpowers',
    example: [Superpower.FLIGHT, Superpower.INVISIBILITY],
    isArray: true,
    enum: Superpower,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Superpower, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return value;
  })
  superpowers?: Superpower[];

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ['nickname', 'real_name', 'created_at'],
    default: 'created_at',
  })
  @IsOptional()
  @IsString()
  sortBy: string = 'created_at';
  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';
}
