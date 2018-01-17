import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserDto } from '../../models/user.dto';
import { AuthService } from '../../services/auth/auth.service';
import { DatabaseService } from '../../services/database/database.service';

@Controller('users')
export class UserController {
  constructor(private databaseService: DatabaseService, private authService: AuthService) {}

  @Get('/')
  async getAll(@Query('search') search: string) {
    let usersStatement = this.databaseService.db
      .select()
      .from('User');

    if (search) {
      usersStatement = usersStatement.containsText({
        name: search
      });
    }

    const users = await usersStatement.all();

    return users.map(this.removePassword);
  }

  @Get('/:userId')
  async getById(@Param('userId') userId: string) {
    const user = this.databaseService.db.record.get(`#${userId}`);

    if (!user) {
      throw user;
    }

    return this.removePassword(user);
  }

  @Post('/')
  async create(@Body() userDto: UserDto) {
    const User = await this.databaseService.db.class.get('User');

    const password = await this.authService.hash(userDto.password);
    const data = {
      login: userDto.login,
      password
    };

    const user = await User.create(data as any);

    return this.removePassword(user);
  }

  @Patch('/:userId')
  async updateById(@Param('userId') userId: string, @Body() userDto: UserDto) {
    const password = await this.authService.hash(userDto.password);
    const data = {
      login: userDto.login,
      password
    };

    const user = await this.databaseService.db
      .update(`#${userId}`)
      .set(data)
      .return('AFTER')
      .one();

    return this.removePassword(user);
  }

  private removePassword(user): UserDto {
    const { password, ...rest } = user;
    return { ...rest };
  }
}
