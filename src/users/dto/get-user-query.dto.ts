import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetUsersQueryDto {
  @Type(() => Number)
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Type(() => Number)
  @ApiPropertyOptional({ example: 10, description: 'Elemets limit' })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    example: 'John',
    description: 'Search by username or email',
  })
  @IsOptional()
  search?: string;
}
