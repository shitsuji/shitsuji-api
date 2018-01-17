import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from '../../models/user.dto';
import { AuthService } from '../../services/auth/auth.service';
import { DatabaseService } from '../../services/database/database.service';

@Controller('auth')
export class AuthController {
  constructor(private databaseService: DatabaseService, private authService: AuthService) {}

  @Post('/login')
  async login(@Body() userDto: UserDto) {
    const password = await this.authService.hash(userDto.password);

    const user = await this.databaseService.db
      .select()
      .from('User')
      .where({
        login: userDto.login,
        password
      })
      .one();

    return user;
  }
}
