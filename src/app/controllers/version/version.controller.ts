import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service';

@Controller('versions')
export class VersionController {
  constructor(private databaseService: DatabaseService) {}

  @Get('/:versionId')
  async getById(@Param('versionId') versionId: string) {
    return this.databaseService.db.record.get(`#${versionId}`);
  }

  @Patch('/:versionId')
  async updateById(@Param('versionId') versionId: string, @Body() body: {}) {
    return this.databaseService.db
      .update(`#${versionId}`)
      .set(body as any)
      .return('AFTER')
      .one();
  }
}
