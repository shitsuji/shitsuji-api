import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProjectDto } from '../../models/project.dto';
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
  async getById(@Param('projectId') projectId: string) {
    try {
      const project = await this.databaseService.db
        .record.get(`#${projectId}`);

      return project;
    } catch (error) {
      return error;
    }
  }

  @Post('/')
  async create(@Body() projectDto: ProjectDto) {
    const Project = await this.databaseService.db.class.get('Project');
    const project = await Project.create({
      name: projectDto.name
    } as any);

    return project;
  }
}
