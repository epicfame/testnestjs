import { Controller, Post, Body, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @Post('login')
  async login(@Request() req) {
    const user = await this.authService.validateUser(req.body.email, req.body.password);
    console.log(user, 'user login data')
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}
