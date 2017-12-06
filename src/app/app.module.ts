import { Module } from '@nestjs/common';
import { ApplicationController } from './controllers/application/application.controller';
import { ProjectController } from './controllers/project/project.controller';
import { DatabaseService } from './services/database/database.service';

@Module({
  controllers: [
    ProjectController,
    ApplicationController
  ],
  components: [
    DatabaseService
  ]
})
export class ApplicationModule {}
