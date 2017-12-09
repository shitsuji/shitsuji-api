import { Controller, Get, Param, Query } from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service';

@Controller('projects')
export class ProjectController {
  constructor(private databaseService: DatabaseService) {}

  @Get('/')
  async getAll(@Query('search') search: string) {
    let projectsStatement = this.databaseService.db
      .select()
      .from('Project');

    if (search) {
      projectsStatement = projectsStatement.containsText({
        name: search
      });
    }

    return projectsStatement.all();
  }

  @Get('/:projectId')
  async getById(@Param('projectId', ()) projectId: { projectId: string }) {
    try {
      const project = await this.databaseService.db
        .record.get(`#${params.projectId}`);

      return project;
    } catch (error) {
      return error;
    }
  }
}
