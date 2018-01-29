import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
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
    return this.databaseService.db.insert()
      .into('Project')
      .set({
        name: projectDto.name
      })
      .one();
  }

  @Patch('/:projectId')
  async updateById(@Param('projectId') projectId: string, @Body() body: ProjectDto) {
    const { name } = body;
    const data = { name };

    return this.databaseService.db
      .update(`#${projectId}`)
      .set(data)
      .return('AFTER')
      .one();
  }

  @Get('/:projectId/applications')
  async getApplications(@Param('projectId') projectId: string) {
    return this.databaseService.db
      .select(`expand(in('PartOf'))`)
      .from('Project')
      .where({
        '@rid': `#${projectId}`
      })
      .all();
  }

  @Post('/:projectId/applications')
  async addAplication(@Param('projectId') projectId: string, @Body() applicationDto: ApplicationDto) {
    return this.databaseService.db.create('EDGE', 'PartOf')
      .from(`#${applicationDto['@rid']}`)
      .to(`#${projectId}`)
      .one();
  }

  @Put('/:projectId/applications')
  async upsertAplication(@Param('projectId') projectId: string, @Body() applicationsIds: string[]) {
    return this.databaseService.db
      .let('first', this.databaseService.db
        .delete('EDGE PartOf')
        .to(`#${projectId}`)
      )
      .let('second', this.databaseService.db
        .create('EDGE', 'PartOf')
        .from(`[${applicationsIds.map((id) => '#' + id)}]`)
        .to(`[${new Array(applicationsIds.length).fill('#' + projectId)}]`)
      )
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
}
