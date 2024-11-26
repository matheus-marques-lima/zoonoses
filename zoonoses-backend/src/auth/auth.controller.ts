import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local.guard';
import { UserId } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('me')
  info(@UserId() user: number) {
    return this.usersService.findOne(user);
  }

  @Public()
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  login(@Request() req: Express.Request) {
    return this.authService.login(req.user);
  }
}
