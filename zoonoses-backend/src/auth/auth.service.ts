import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(loginDto: LoginDto) {
    const user = await this.usersService.findOneBy(loginDto.email);

    if (!user) return null;

    try {
      const match = await bcrypt.compare(loginDto.password, user.password);

      if (!match) return null;
    } catch {
      return null;
    }

    return this.usersService.findOne(user.id);
  }

  login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
