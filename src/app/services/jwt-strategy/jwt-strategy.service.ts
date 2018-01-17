import { Component, HttpException, HttpStatus, Inject } from '@nestjs/common';
import * as _passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AUTH_SECRET, PASSPORT } from '../../constants';
import { AuthService } from '../auth/auth.service';

@Component()
export class JwtStrategyService extends Strategy {
    constructor(private authService: AuthService, @Inject(AUTH_SECRET) secret: typeof AUTH_SECRET,
                @Inject(PASSPORT) private passport: typeof _passport) {
      super(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          passReqToCallback: true,
          secretOrKey: secret
        },
        async (req, token, done) => await this.verify(req, token, done)
      );

      this.passport.use(this);
    }

    async verify(req: Request, token: any, done: VerifiedCallback) {
      const userId = await this.authService.validate(token);
      if (!userId) {
        done(new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED), false);
      }

      done(null, { id: userId });
    }
}
