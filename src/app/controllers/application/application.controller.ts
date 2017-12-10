import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApplicationDto } from '../../models/application.dto';
import { VersionDto } from '../../models/version.dto';
import { DatabaseService } from '../../services/database/database.service';

@Controller('/applications')
export class ApplicationController {
  constructor(private databaseService: DatabaseService) {}

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
    const Application = await this.databaseService.db.class.get('Application');
    return Application.create({
      ...applicationDto
    } as any);
  }

  @Patch('/:applicationId')
  async updateById(@Param('applicationId') applicationId: string, @Body() body: {}) {
    return this.databaseService.db
      .update(`#${applicationId}`)
      .set(body as any)
      .return('AFTER')
      .one();
  }

  @Get('/:applicationId/versions')
  async getVersions(@Param('applicationId') applicationId: string) {
    return this.databaseService.db
      .select('in(Has)')
      .from('Application')
      .where({
        '@rid': `#${applicationId}`
      })
      .all();
  }

  @Post('/:applicationId/versions')
  async addVersion(@Body() versionDto: VersionDto, @Param('applicationId') applicationId: string) {
    return this.databaseService.db
      .let('version', this.databaseService.db
        .create('VERTEX', 'Version')
        .set({ ...versionDto } as any)
      )
      .let('has', this.databaseService.db
        .create('EDGE', 'Has')
        .from(`#${applicationId}`)
        .to('$version')
      )
      .commit()
      .return('$version')
      .one();
  }
}
