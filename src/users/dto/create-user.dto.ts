import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username', type: 'string' })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email',
    type: 'string',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password',
    type: 'string',
  })
  @IsString()
  password: string;
}
