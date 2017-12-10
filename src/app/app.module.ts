import { Module } from '@nestjs/common';
import { ApplicationController } from './controllers/application/application.controller';
import { ProjectController } from './controllers/project/project.controller';
import { VersionController } from './controllers/version/version.controller';
import { DatabaseService } from './services/database/database.service';

@Module({
  controllers: [
    ProjectController,
    ApplicationController,
    VersionController
  ],
  components: [
    DatabaseService
  ]
})
export class ApplicationModule {}
