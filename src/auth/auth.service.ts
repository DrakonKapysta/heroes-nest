import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user,dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDto): Promise<string> {
    return this.jwtService.sign(user);
  }

  async verifyUser(email: string, password: string): Promise<UserDto> {
    const user = await this.usersService.findByEmail(email);
    const isPasswordValied = await bcrypt.compare(password, user.password);
    if (!isPasswordValied) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
