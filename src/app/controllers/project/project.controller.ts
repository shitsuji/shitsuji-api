import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service';

@Controller('projects')
export class ProjectController {

  constructor(private databaseService: DatabaseService) {}

  @Get('/')
  async getAll() {
    const projects = await this.databaseService.db
    .select()
    .from('Project')
    .all();

    return projects;
  }

  @Get('/:projectId')
  async getById(@Param() params: { projectId: string }) {
    try {
      const project = await this.databaseService.db
        .record.get(`#${params.projectId}`);

      return project;
    } catch (error) {
      return error;
    }
  }
}
