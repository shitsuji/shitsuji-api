import { Component, Inject } from '@nestjs/common';
import * as _bcrypt from 'bcrypt';
import * as _jsonwebtoken from 'jsonwebtoken';
import { AUTH_SECRET, AUTH_TOKEN_EXPIRATION, BCRYPT, JSONWEBTOKEN, SALT_ROUNDS_TOKEN } from '../../constants';
import { TokenPayload } from '../../models/token.model';
import { UserDto } from '../../models/user.dto';

@Component()
export class AuthService {
  constructor(@Inject(JSONWEBTOKEN) private jsonwebtoken: typeof _jsonwebtoken,
    @Inject(AUTH_SECRET) private secret: typeof AUTH_SECRET,
    @Inject(AUTH_TOKEN_EXPIRATION) private expiresIn: typeof AUTH_TOKEN_EXPIRATION,
    @Inject(BCRYPT) private bcrypt: typeof _bcrypt,
    @Inject(SALT_ROUNDS_TOKEN) private saltRounds: number) {}

  async hash(password: string): Promise<string> {
    return this.bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return this.bcrypt.compare(password, hash);
  }

  async createToken(userId: string): Promise<string> {
    const payload: TokenPayload = { userId };
    const token = this.jsonwebtoken.sign(payload, this.secret, { expiresIn: this.expiresIn });

    return token;
  }

  async validate(payload: TokenPayload): Promise<boolean|string> {
    if (!payload.userId) {
      return false;
    }

    return payload.userId;
  }

  removePassword(user): UserDto {
    const { password, ...rest } = user;
    return { ...rest };
  }
}
