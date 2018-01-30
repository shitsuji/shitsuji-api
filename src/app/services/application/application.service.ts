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

  async addApplicationVersionByKey(versionDto: VersionCreateDto, applicationKey: string) {
    return this.databaseService.db
      .let('version', this.databaseService.db
        .create('VERTEX', 'Version')
        .set({ ...versionDto } as any)
      )
      .let('application', this.databaseService.db
        .select()
        .from('Application')
        .where({
          key: applicationKey
        })
      )
      .let('has', this.databaseService.db
        .create('EDGE', 'Has')
        .from('$application')
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

  async getOrCreateApplicationVersion(applicationKey: string, versionDto: VersionCreateDto) {
    const result = await this.databaseService.db
      .let('versions', this.databaseService.db
        .select(`expand(out('Has'))`)
        .from('Application')
        .where({
          key: applicationKey
        })
      )
      .let('version', this.databaseService.db
        .select()
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

    return this.addApplicationVersionByKey(versionDto, applicationKey) as Promise<VersionDto>;
  }

  async connectVersions(key, version, dependencyKey, dependencyVersion) {
    try {
      return await this.databaseService.db
        .let('versions', this.databaseService.db
          .select(`expand(out('Has'))`)
          .from('Application')
          .where({
            key
          })
        )
        .let('version', this.databaseService.db
          .select()
          .from('$versions')
          .where({
            number: version
          })
        )
        .let('depVersions', this.databaseService.db
          .select(`expand(out('Has'))`)
          .from('Application')
          .where({
            key: dependencyKey
          })
        )
        .let('depVersion', this.databaseService.db
          .select()
          .from('$depVersions')
          .where({
            number: dependencyVersion
          })
        )
        .let('result', this.databaseService.db
          .create('EDGE', 'DependsOn')
          .from('$version')
          .to('$depVersion')
        )
        .commit()
        .return('$result')
        .one();
    } catch (e) {
      return null;
    }
  }

  async connectApplicationToRepository(key: string, repositoryRid: string) {
    try {
      return await this.databaseService.db
        .let('application', this.databaseService.db
          .select()
          .from('Application')
          .where({
            key
          })
        )
        .let('has', this.databaseService.db
          .create('EDGE', 'IsIn')
          .from('$application')
          .to(repositoryRid)
        )
        .commit()
        .one();
    } catch (e) {
      return null;
    }
  }
}
