import { Inject, MiddlewaresConsumer, Module, RequestMethod } from '@nestjs/common';
import * as _passport from 'passport';
import { PASSPORT } from './constants';
import { ApplicationController } from './controllers/application/application.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { ProjectController } from './controllers/project/project.controller';
import { RepositoryController } from './controllers/repository/repository.controller';
import { UserController } from './controllers/user/user.controller';
import { VersionController } from './controllers/version/version.controller';
import { WebhookController } from './controllers/webhook/webhook.controller';
import { BcryptProvider, SaltRoundsProvider } from './providers/bcrypt.provider';
import { configProvider } from './providers/config.provider';
import { gitProvider } from './providers/git.provider';
import {
  AuthSecretProvider,
  AuthTokenExpirationProvider,
  JsonWebTokenProvider,
  PassportJwtProvider,
  PassportProvider
} from './providers/passport.provider';
import { ApplicationService } from './services/application/application.service';
import { AuthService } from './services/auth/auth.service';
import { CryptoService } from './services/crypto/crypto.service';
import { DatabaseService } from './services/database/database.service';
import { JwtStrategyService } from './services/jwt-strategy/jwt-strategy.service';
import { RepositoryService } from './services/repository/repository.service';
import { VersionService } from './services/version/version.service';
import { WebhookService } from './services/webhook/webhook.service';
import { databaseConfigProvider } from './providers/database-config.provider';

@Module({
  controllers: [
    ProjectController,
    ApplicationController,
    VersionController,
    RepositoryController,
    UserController,
    AuthController,
    WebhookController
  ],
  components: [
    configProvider,
    gitProvider,

    BcryptProvider,
    SaltRoundsProvider,

    AuthSecretProvider,
    AuthTokenExpirationProvider,
    JsonWebTokenProvider,
    PassportProvider,
    PassportJwtProvider,
    databaseConfigProvider,

    DatabaseService,
    RepositoryService,
    CryptoService,
    AuthService,
    JwtStrategyService,

    ApplicationService,
    VersionService,
    WebhookService,
  ]
})
export class ApplicationModule {
  constructor(@Inject(PASSPORT) private passport: typeof _passport) {}

  public configure(consumer: MiddlewaresConsumer) {
    consumer
      .apply(this.passport.authenticate('jwt', { session: false }))
      .forRoutes(
        ProjectController,
        ApplicationController,
        VersionController,
        RepositoryController,
        UserController,
        { path: 'auth/token', method: RequestMethod.POST }
      );
  }
}
