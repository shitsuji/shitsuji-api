import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { VersionDto } from '../../models/version.dto';
import { DatabaseService } from '../../services/database/database.service';

@Controller('versions')
export class VersionController {
  constructor(private databaseService: DatabaseService) {}

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
}
