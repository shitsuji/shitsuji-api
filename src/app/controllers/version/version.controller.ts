import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { VersionDto } from '../../models/version.dto';
import { DatabaseService } from '../../services/database/database.service';
import { VersionService } from '../../services/version/version.service';

@Controller('versions')
export class VersionController {
  constructor(private databaseService: DatabaseService, private versionService: VersionService) {}

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
}
