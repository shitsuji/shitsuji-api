import {Controller, Get} from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service';

@Controller('project')
export class ProjectController {

  constructor(private databaseService: DatabaseService) {}

  @Get('/')
  async getAll() {
    const projects = await this.databaseService.db
    .select()
    .from('Project')
    .all();

    return projects;
  }
}
