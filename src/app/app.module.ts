import { Module } from '@nestjs/common';
import { ApplicationController } from './controllers/application/application.controller';
import { ProjectController } from './controllers/project/project.controller';
import { RepositoryController } from './controllers/repository/repository.controller';
import { VersionController } from './controllers/version/version.controller';
import { configProvider } from './providers/config.provider';
import { gitProvider } from './providers/git.provider';
import { CryptoService } from './services/crypto/crypto.service';
import { DatabaseService } from './services/database/database.service';
import { RepositoryService } from './services/repository/repository.service';

@Module({
  controllers: [
    ProjectController,
    ApplicationController,
    VersionController,
    RepositoryController
  ],
  components: [
    DatabaseService,
    RepositoryService,
    gitProvider,
    configProvider,
    CryptoService
  ]
})
export class ApplicationModule {}
