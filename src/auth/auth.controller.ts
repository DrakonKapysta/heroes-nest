import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dto/user,dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOkResponse({ type: UserDto, description: 'Login successful' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@gmail.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    console.log('Authenticated user:', user);
    const token = await this.authService.login(user);
    res.cookie('heroes_auth', token, {
      httpOnly: true,
    });
    return user;
  }
  @ApiConflictResponse({
    description: 'User already exists',
    example: {
      statusCode: 409,
      message: 'User with this email or username already exists',
      error: 'Conflict',
    },
  })
  @ApiCreatedResponse({ type: UserDto })
  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }
}
