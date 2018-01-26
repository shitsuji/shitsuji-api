import { Component } from '@nestjs/common';
import { Record } from 'orientjs';
import { RepositoryModel } from '../../models/repository.model';
import { VersionCreateDto } from '../../models/version-create.dto';
import { ApplicationConfig, CommandType, ConfigPackage, WebhookCommand } from '../../models/webhook.model';
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
    const commandsList = packages.map((p) => this.readCommands(p));
    const reduced = this.mergeCommandsList(commandsList);

    return this.executeCommands(reduced);
  }

  async push(repository: Record & RepositoryModel, { branch, hash }: { branch: string, hash: string }) {
    if (repository.branch && repository.branch !== branch) {
      return;
    }

    const privateKey = this.cryptoService.decrypt(repository.privateKey);
    const { publicKey, url, name } = repository;
    const pack = await this.repositoryService.readVersion(name, hash);

    const commandsList = [this.readCommands(pack)];
    const reduced = this.mergeCommandsList(commandsList);

    return this.executeCommands(reduced);
  }

  private readCommands({ config, commit }: ConfigPackage): { [key: number]: Array<{}> } {
    const commands = {
      [CommandType.GetOrCreateApplication]: [],
      [CommandType.GetOrCreateApplicationVersion]: [],
      [CommandType.ConnectVersions]: [],
    };

    if (!config.applications || !config.applications.length) {
      return commands;
    }

    for (const app of config.applications) {
      commands[CommandType.GetOrCreateApplication].push({
        key: app.key
      });

      commands[CommandType.GetOrCreateApplicationVersion].push({
        versionDto: {
          number: app.version,
          commit
        },
        applicationKey: app.key
      });

      if (!app.dependencies) {
        continue;
      }

      for (const dep of app.dependencies) {
        commands[CommandType.GetOrCreateApplication].push({
          key: dep.key
        });

        commands[CommandType.GetOrCreateApplicationVersion].push({
          versionDto: {
            number: dep.version,
            commit
          },
          applicationKey: dep.key
        });

        commands[CommandType.ConnectVersions].push({
          key: app.key,
          version: app.version,
          dependencyKey: dep.key,
          dependencyVersion: dep.version
        });
      }
    }

    return commands;
  }

  private mergeCommandsList(commandsList: Array<{ [key: number]: Array<{}> }>) {
    const reduced = commandsList.reduce((result, commands) => {
      result[CommandType.GetOrCreateApplication].push(...commands[CommandType.GetOrCreateApplication]);
      result[CommandType.GetOrCreateApplicationVersion].push(...commands[CommandType.GetOrCreateApplicationVersion]);
      result[CommandType.ConnectVersions].push(...commands[CommandType.ConnectVersions]);

      return result;
    }, {
      [CommandType.GetOrCreateApplication]: [],
      [CommandType.GetOrCreateApplicationVersion]: [],
      [CommandType.ConnectVersions]: [],
    });

    reduced[CommandType.GetOrCreateApplication] = this
      .uniqBy(reduced[CommandType.GetOrCreateApplication], JSON.stringify);

    reduced[CommandType.GetOrCreateApplicationVersion] = this
      .uniqBy(reduced[CommandType.GetOrCreateApplicationVersion], (params) => {
        return JSON.stringify({
          applicationKey: params.applicationKey,
          version: params.versionDto.number
        });
      });

    reduced[CommandType.ConnectVersions] = this
      .uniqBy(reduced[CommandType.ConnectVersions], JSON.stringify);

    return reduced;
  }

  private async executeCommands(commands) {
    await Promise.all(commands[CommandType.GetOrCreateApplication]
    .map(({ key }) => {
      return this.applicationService.getOrCreateApplication(key);
    }));

    await Promise.all(commands[CommandType.GetOrCreateApplicationVersion]
    .map(({ versionDto, applicationKey }) => {
      return this.applicationService.getOrCreateApplicationVersion(applicationKey, versionDto);
    }));

    await Promise.all(commands[CommandType.ConnectVersions]
    .map(({key, version, dependencyKey, dependencyVersion}) => {
      return this.applicationService.connectVersions(key, version, dependencyKey, dependencyVersion);
    }));
  }

  private uniqBy(arr: Array<{}>, predicate: (...args) => string | string) {
    const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];
    return [...arr
      .reduce<Map<string, {}>>((map, item) => {
        const key = cb(item);
        if (!map.has(key)) {
          map.set(key, item);
        }

        return map;
      }, new Map())
      .values()];
  }
}
