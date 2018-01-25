import { Component } from '@nestjs/common';
import { ApplicationCreateDto } from '../../models/application-create.dto';
import { ApplicationDto } from '../../models/application.dto';
import { VersionCreateDto } from '../../models/version-create.dto';
import { VersionDto } from '../../models/version.dto';
import { DatabaseService } from '../database/database.service';

@Component()
export class ApplicationService {
  constructor(private databaseService: DatabaseService) {}

  async addApplicationVersion(versionDto: VersionCreateDto, applicationId: string) {
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

  async createApplication(applicationDto: ApplicationCreateDto) {
    return this.databaseService.db.insert()
      .into('Application')
      .set({
        ...applicationDto
      })
      .one();
  }

  async getOrCreateApplication(key: string): Promise<ApplicationDto> {
    let result = await this.databaseService.db
      .select()
      .from('Application')
      .where({ key })
      .one() as ApplicationDto;

    if (result) {
      return result;
    }

    result = await this.createApplication({
      name: key,
      key,
      isGenerated: true
    }) as ApplicationDto;

    return result;
  }

  async getOrCreateApplicationVersion(application: ApplicationDto, versionDto: VersionCreateDto) {
    const result = await this.databaseService.db
    .let('versions', this.databaseService.db
      .select(`expand(out('Has'))`)
      .from('Application')
      .where({
        '@rid': application['@rid']
      })
    )
    .let('version', this.databaseService.db
      .select('*')
      .from('$versions')
      .where({
        number: versionDto.number
      })
    )
    .commit()
    .return('$version')
    .one() as VersionDto;

    if (result) {
      return result;
    }

    const rid = application['@rid'].toString();
    const applicationId = rid.substr(1, rid.length);
    return this.addApplicationVersion(versionDto, applicationId) as Promise<VersionDto>;
  }

  async connectVersions(version: VersionDto, dependency: VersionDto) {
    try {
      return await this.databaseService.db
        .create('EDGE', 'DependsOn')
        .from(version['@rid'])
        .to(dependency['@rid'])
        .one();
    } catch (e) {
      return null;
    }
  }
}
