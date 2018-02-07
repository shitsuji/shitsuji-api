import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Put } from '@nestjs/common';
import { ApplicationDto } from '../../models/application.dto';
import { DependencyDto } from '../../models/dependency.dto';
import { VersionDto } from '../../models/version.dto';
import { ApplicationService } from '../../services/application/application.service';
import { DatabaseService } from '../../services/database/database.service';
import { VersionService } from '../../services/version/version.service';

@Controller('versions')
export class VersionController {
  constructor(private databaseService: DatabaseService,
    private versionService: VersionService,
    private applicationService: ApplicationService) {}

  @Get('/:versionId')
  async getById(@Param('versionId') versionId: string) {
    return this.databaseService.db.record.get(`#${versionId}`);
  }

  @Patch('/:versionId')
  async updateById(@Param('versionId') versionId: string, @Body() body: VersionDto) {
    const data = {
      number: body.number
    };

    return this.databaseService.db
      .update(`#${versionId}`)
      .set(data)
      .return('AFTER')
      .one();
  }

  @Get('/:versionId/dependers')
  async getDependers(@Param('versionId') versionId: string) {
    return this.versionService.getVersionDependers(versionId);
  }

  @Get('/:versionId/dependees')
  async getDependees(@Param('versionId') versionId: string) {
    return this.versionService.getVersionDependees(versionId);
  }

  @Delete('/:versionId')
  async deleteVersion(@Param('versionId') versionId: string) {
    return this.databaseService.db
      .delete(['VERTEX', 'Version'])
      .where({
        '@rid': `#${versionId}`
      })
      .one();
  }

  @Put('/:versionId/dependees')
  async upsertDependees(@Param('versionId') versionId: string, @Body() dependees: DependencyDto[]) {
    const application = await this.databaseService.db
      .select('expand(in("Has"))')
      .from('Version')
      .where({
        '@rid': `#${versionId}`
      })
      .one() as ApplicationDto;

    const version = await this.databaseService.db
      .select()
      .from('Version')
      .where({ '@rid': `#${versionId}` })
      .one() as VersionDto;

    if (!application) {
      throw new HttpException('Application not found', HttpStatus.BAD_REQUEST);
    }

    if (!version) {
      throw new HttpException('Version not found', HttpStatus.BAD_REQUEST);
    }

    await this.databaseService.db
      .delete('EDGE DependsOn')
      .from(`#${versionId}`)
      .all();

    if (!dependees || !dependees.length) {
      return [];
    }

    await Promise.all(dependees.map((dep) =>
      this.applicationService.connectVersions(
        application.key,
        version.number,
        dep.application.key,
        dep.version.number
      )
    ));

    return this.versionService.getVersionDependees(versionId);
  }
}
