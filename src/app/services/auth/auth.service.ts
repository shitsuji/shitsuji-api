import { Component, Inject } from '@nestjs/common';
import * as _bcrypt from 'bcrypt';
import { BCRYPT, SALT_ROUNDS_TOKEN } from '../../constants';
import { UserDto } from '../../models/user.dto';

@Component()
export class AuthService {
  constructor(@Inject(BCRYPT) private bcrypt: typeof _bcrypt,
  @Inject(SALT_ROUNDS_TOKEN) private saltRounds: number) {}

  async hash(password: string): Promise<string> {
    return this.bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return this.bcrypt.compare(password, hash);
  }
}
