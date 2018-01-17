import { Module } from '@nestjs/common';
import { ApplicationController } from './controllers/application/application.controller';
import { ProjectController } from './controllers/project/project.controller';
import { RepositoryController } from './controllers/repository/repository.controller';
import { UserController } from './controllers/user/user.controller';
import { VersionController } from './controllers/version/version.controller';
import { BcryptProvider, SaltRoundsProvider } from './providers/bcrypt.provider';
import { configProvider } from './providers/config.provider';
import { gitProvider } from './providers/git.provider';
import { AuthService } from './services/auth/auth.service';
import { CryptoService } from './services/crypto/crypto.service';
import { DatabaseService } from './services/database/database.service';
import { RepositoryService } from './services/repository/repository.service';

@Module({
  controllers: [
    ProjectController,
    ApplicationController,
    VersionController,
    RepositoryController,
    UserController,
    AuthController
  ],
  components: [
    DatabaseService,
    RepositoryService,
    gitProvider,
    configProvider,
    CryptoService,
    BcryptProvider,
    SaltRoundsProvider,
    AuthService
  ]
})
export class ApplicationModule {}
import {AuthController} from './controllers/auth/auth.controller';
