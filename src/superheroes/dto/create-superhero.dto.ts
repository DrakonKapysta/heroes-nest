import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Superpower } from '../enum/superpowers.enum';

export class CreateSuperheroDto {
  @ApiProperty({ example: 'Batman', description: 'Unique superhero nickname' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nickname: string;

  @ApiProperty({
    example: 'Bruce Wayne',
    description: 'Real name of the superhero',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  real_name?: string;

  @ApiProperty({
    description: 'Superhero origin description',
    example: 'After witnessing, as a child ...',
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  origin_description?: string;

  @ApiProperty({
    example: 'To fight crime and protect Gotham City',
    description: 'Superhero catchphrase',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  catch_phrase?: string;

  @ApiPropertyOptional({
    example: [Superpower.FLIGHT, Superpower.SUPER_STRENGTH],
    description: 'List of superpowers',
    isArray: true,
    enum: Superpower,
  })
  @IsEnum(Superpower, { each: true })
  @IsArray()
  @IsOptional()
  superpowers?: Superpower[] = [];

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Array of hero images files',
  })
  @IsArray()
  @IsOptional()
  images?: File[] = [];
}
