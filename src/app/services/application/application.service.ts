import { Component } from '@nestjs/common';
import { ApplicationDto } from '../../models/application.dto';
import { VersionDto } from '../../models/version.dto';
import { DatabaseService } from '../database/database.service';

@Component()
export class ApplicationService {
  constructor(private databaseService: DatabaseService) {}

  async addApplicationVersion(versionDto: VersionDto, applicationId: string) {
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

  async createApplication(applicationDto: ApplicationDto) {
    return this.databaseService.db.insert()
      .into('Application')
      .set({
        ...applicationDto
      })
      .one();
  }

  async getOrCreateApplications(applications: ApplicationDto[]) {
    return Promise.all(applications.map(async (app) => {
      let result;

      try {
        result = await this.databaseService.db
          .select()
          .from('Application')
          .where({ key: app.key })
          .one();
      } catch (e) {
        result = await this.createApplication(app);
      }

      return result;
    }));
  }
}
