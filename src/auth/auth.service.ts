import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { LoginResponse } from './dto/login.response';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<LoginResponse | null> {
    try {
      const user = await this.usersService.findByEmailWithPassword(email);

      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid) {
        const res: LoginResponse = {
          email: user.email,
          role: user.role,
        };
        return res;
      }

      return null;
    } catch {
      return null;
    }
  }
}
