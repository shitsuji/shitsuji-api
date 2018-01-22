import { Component } from '@nestjs/common';
import { Record } from 'orientjs';
import { RepositoryModel } from '../../models/repository.model';
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

    const configs = await this.repositoryService.walkHistoryFromHead(repo, branch);
    configs.forEach(this.handleConfig);
  }

  async push(repository: Record & RepositoryModel, { branch, hash }: { branch: string, hash: string }) {
    if (repository.branch && repository.branch !== branch) {
      return;
    }

    const privateKey = this.cryptoService.decrypt(repository.privateKey);
    const { publicKey, url, name } = repository;
    const conf = await this.repositoryService.readVersion(name, hash);
  }

  private async handleConfig(config) {
    const { applications: appConfigs } = config;

    if (!appConfigs || !appConfigs.length) {
      return;
    }

    const applications = await this.applicationService.getOrCreateApplications(
      appConfigs.map(({ version, dependencies, ...rest }) => rest)
    );

    const promises = appConfigs.map(async (app) => {
      const { dependencies: depsConfigs } = app;

      if (depsConfigs && depsConfigs.length) {
        const dependencies = await this.applicationService.getOrCreateApplications(
          depsConfigs.map(({ version, ...rest }) => rest)
        );

      }
    });
  }
}
