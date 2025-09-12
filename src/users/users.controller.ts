import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { GetUsersQueryDto } from './dto/get-user-query.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user,dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOkResponse({
    type: [UserDto],
    example: [{ id: '1', username: 'John', email: 'example@gmail.com' }],
  })
  async getUsers(@Query() query: GetUsersQueryDto) {
    this.logger.log(
      `Get users page: ${query.page}, limit: ${query.limit}, search: ${query.search}`,
    );
    return this.userService.findAll(query);
  }
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    this.logger.log(`Get user by id: ${id}`);
    return this.userService.findById(id);
  }
  @ApiCreatedResponse({ type: UserDto })
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    this.logger.log(`Create user: ${JSON.stringify(user)}`);
    return this.userService.create(user);
  }
  @ApiResponse({
    type: UserDto,
    description: 'The user has been updated.',
    status: 200,
  })
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    this.logger.log(`Update user id: ${id}, data: ${JSON.stringify(userData)}`);
    return this.userService.update(id, userData);
  }
  @ApiResponse({
    status: 204,
    description: 'The user has been deleted.',
    type: UserDto,
  })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    this.logger.log(`Delete user id: ${id}`);
    return this.userService.delete(id);
  }
}
