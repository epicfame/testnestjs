import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // Protects all routes in this controller with JWT authentication
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData: UserDto) {
    return this.usersService.create(userData);
  }

  @Get()
  async findAll() {
    console.log("Getting all users")
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() userData: UserDto) {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Post('register')
  async register(@Body() userData: UserDto) { 
    return this.usersService.create(userData);
  }
}
