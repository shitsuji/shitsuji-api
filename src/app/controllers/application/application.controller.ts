import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApplicationDto } from '../../models/application.dto';
import { VersionDto } from '../../models/version.dto';
import { ApplicationService } from '../../services/application/application.service';
import { DatabaseService } from '../../services/database/database.service';
import { RepositoryService } from '../../services/repository/repository.service';

@Controller('/applications')
export class ApplicationController {
  constructor(private databaseService: DatabaseService, private applicationService: ApplicationService) {}

  @Get('/')
  async getAll(@Query('search') search: string) {
    let applicationsStatement = this.databaseService.db
      .select()
      .from('Application');

    if (search) {
      applicationsStatement = applicationsStatement.containsText({
        name: search
      });
    }

    return applicationsStatement.all();
  }

  @Get('/:applicationId')
  async getById(@Param('applicationId') applicationId: string) {
    return this.databaseService.db.record.get(`#${applicationId}`);
  }

  @Post('/')
  async create(@Body() applicationDto: ApplicationDto) {
    this.applicationService.createApplication(applicationDto);
  }

  @Patch('/:applicationId')
  async updateById(@Param('applicationId') applicationId: string, @Body() body: ApplicationDto) {
    const { key, name } = body;
    const data = { key, name };

    return this.databaseService.db
      .update(`#${applicationId}`)
      .set(data)
      .return('AFTER')
      .one();
  }

  @Get('/:applicationId/versions')
  async getVersions(@Param('applicationId') applicationId: string) {
    return this.databaseService.db
      .select(`expand(out('Has'))`)
      .from('Application')
      .where({
        '@rid': `#${applicationId}`
      })
      .all();
  }

  @Post('/:applicationId/versions')
  async addVersion(@Body() versionDto: VersionDto, @Param('applicationId') applicationId: string) {
    return this.applicationService.addApplicationVersion(versionDto, applicationId);
  }
}
