import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service';

@Controller('/applications')
export class ApplicationController {
  constructor(private databaseService: DatabaseService) {}

  @Get('/')
  async getAll() {
    const projects = await this.databaseService.db
    .select()
    .from('Application')
    .all();

    return projects;
  }
}
