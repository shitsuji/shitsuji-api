import { Body, Controller, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { UserDto } from '../../models/user.dto';
import { AuthService } from '../../services/auth/auth.service';
import { DatabaseService } from '../../services/database/database.service';

@Controller('auth')
export class AuthController {
  constructor(private databaseService: DatabaseService, private authService: AuthService) {}

  @Post('/login')
  async login(@Body() userDto: UserDto) {
    const user = await this.databaseService.db
      .select()
      .from('User')
      .where({
        login: userDto.login
      })
      .one() as UserDto;

    if (!user) {
      throw new HttpException('Inavlid user or password', HttpStatus.BAD_REQUEST);
    }

    const passwordMatch = await this.authService.compare(userDto.password, user.password);

    if (!passwordMatch) {
      throw new HttpException('Inavlid user or password', HttpStatus.BAD_REQUEST);
    }

    const token = await this.authService.createToken(user['@rid']);
    const response = {
      user: this.authService.removePassword(user),
      token
    };

    return response;
  }

  @Post('/token')
  async token(@Req() req: Express.Request) {
    const userId = req.user.id;
    const user = await this.databaseService.db.record.get(`#${userId}`);

    if (!user) {
      throw new HttpException('Token not valid', HttpStatus.BAD_REQUEST);
    }

    const token = await this.authService.createToken(user['@rid']);
    const response = {
      user: this.authService.removePassword(user),
      token
    };

    return response;
  }
}
