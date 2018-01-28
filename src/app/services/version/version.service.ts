import { Component } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Component()
export class VersionService {
  constructor(private databaseService: DatabaseService) {}

  // Versions of apps that this version depends on
  async getVersionDependers(versionId: string) {
    const result = await this.databaseService.db
      .let('versions', this.databaseService.db
        .select(`expand(out('DependsOn'))`)
        .from('Version')
        .where({
          '@rid': `#${versionId}`
        })
      )
      .let('applications', this.databaseService.db
        .select(`expand(in('Has'))`)
        .from('$versions')
      )
      .commit()
      .return(`unionall($versions, set($applications))`)
      .all();

    return this.mapResult(result);
  }

  // Versions of apps that depend on provided version
  async getVersionDependees(versionId: string) {
    const result = await this.databaseService.db
      .let('versions', this.databaseService.db
        .select(`expand(in('DependsOn'))`)
        .from('Version')
        .where({
          '@rid': `#${versionId}`
        })
      )
      .let('applications', this.databaseService.db
        .select(`expand(in('Has'))`)
        .from('$versions')
      )
      .commit()
      .return(`unionall($versions, set($applications))`)
      .all();

    return this.mapResult(result);
  }

  private mapResult(result) {
    if (!result || !result.length) {
      return;
    }

    const appIndex = result.findIndex((r) => r['@class'] === 'Application');

    if (appIndex < 0) {
      return;
    }

    const versions = result.slice(0, appIndex);
    const applications = result.slice(appIndex, result.length);

    return versions
    .map((version: any) => {
      const edge = version.in_Has.all()[0].toString();
      const application = applications.find((app: any) => app.out_Has
        .all()
        .map((rid) => rid.toString())
        .indexOf(edge) !== -1);

      return {
        version,
        application
      };
    });
  }
}
