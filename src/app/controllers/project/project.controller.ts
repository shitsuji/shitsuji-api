import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import * as Bluebird from 'bluebird';
import { Statement } from 'orientjs';
import { ApplicationDto } from '../../models/application.dto';
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
    return this.databaseService.db.record.get(`#${projectId}`);
  }

  @Post('/')
  async create(@Body() projectDto: ProjectDto) {
    const Project = await this.databaseService.db.class.get('Project');
    const project = await Project.create({
      name: projectDto.name
    } as any);

    return project;
  }

  @Get('/:projectId/applications')
  async getApplications(@Param('projectId') projectId: string,
    @Query('filter') filter: [{ applicationId: string, version: string }]) {
    const applicationIds = filter.map((item) => item.applicationId);

    return this.databaseService.db
      .let('applications', this.databaseService.db
        .select(`expand(in('PartOf'))`)
        .from('Project')
        .where({
          '@rid': `#${projectId}`
        })
      )
      .commit()
      .return('$applications')
      .all();
  }

  @Post('/:projectId/applications')
  async addAplication(@Param('projectId') projectId: string, @Body() applicationDto: ApplicationDto) {
    return this.databaseService.db.create('EDGE', 'PartOf')
      .from(`#${applicationDto['@rid']}`)
      .to(`#${projectId}`)
      .one();
  }
}
