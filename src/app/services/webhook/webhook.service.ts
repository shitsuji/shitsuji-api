import { Component } from '@nestjs/common';
import { Record } from 'orientjs';
import { RepositoryModel } from '../../models/repository.model';
import { VersionCreateDto } from '../../models/version-create.dto';
import { ApplicationConfig, ConfigPackage } from '../../models/webhook.model';
import { CryptoService } from '../../services/crypto/crypto.service';
import { DatabaseService } from '../../services/database/database.service';
import { RepositoryService } from '../../services/repository/repository.service';
import { ApplicationService } from '../application/application.service';

@Component()
export class WebhookService {
  constructor(private repositoryService: RepositoryService, private databaseService: DatabaseService,
    private cryptoService: CryptoService, private applicationService: ApplicationService) {}

  async initialize(repository: Record & RepositoryModel) {
    const privateKey = this.cryptoService.decrypt(repository.privateKey);
    const { publicKey, url, name, branch = 'master' } = repository;

    const repo = await this.repositoryService.cloneRepository(url, name, {
      publicKey, privateKey
    });

    const packages = await this.repositoryService.walkHistoryFromHead(repo, branch);
    return Promise.all(packages.map((p) => this.handleConfigPackage(p)));
  }

  async push(repository: Record & RepositoryModel, { branch, hash }: { branch: string, hash: string }) {
    if (repository.branch && repository.branch !== branch) {
      return;
    }

    const privateKey = this.cryptoService.decrypt(repository.privateKey);
    const { publicKey, url, name } = repository;
    const pack = await this.repositoryService.readVersion(name, hash);

    return this.handleConfigPackage(pack);
  }

  private async handleConfigPackage({ config, commit }: ConfigPackage) {
    if (!config.applications || !config.applications.length) {
      return;
    }

    return Promise.all(config.applications.map(async (app) => {
      const application = await this.applicationService
        .getOrCreateApplication(app.key);

      const versionDto: VersionCreateDto = {
        number: app.version,
        commit
      };
      const version = await this.applicationService
        .getOrCreateApplicationVersion(application, versionDto);

      if (!app.dependencies || !app.dependencies.length) {
        return;
      }

      return Promise.all(app.dependencies.map(async (dep) => {
        const dependency = await this.applicationService
          .getOrCreateApplication(dep.key);

        const dependencyVersionDto: VersionCreateDto = {
          number: app.version,
          commit
        };

        const dependencyVersion = await this.applicationService
          .getOrCreateApplicationVersion(dependency, dependencyVersionDto);

        return this.applicationService.connectVersions(version, dependencyVersion);
      }));
    }));
  }
}
