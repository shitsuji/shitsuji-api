import { Module } from '@nestjs/common';
import { CONFIG } from './constants';
import { ApplicationController } from './controllers/application/application.controller';
import { ProjectController } from './controllers/project/project.controller';
import { VersionController } from './controllers/version/version.controller';
import { configProvider } from './providers/config.provider';
import { gitProvider } from './providers/git.provider';
import { DatabaseService } from './services/database/database.service';
import { RepositoryService } from './services/repository/repository.service';

@Module({
  controllers: [
    ProjectController,
    ApplicationController,
    VersionController
  ],
  components: [
    DatabaseService,
    RepositoryService,
    gitProvider,
    configProvider
  ]
})
export class ApplicationModule {}
