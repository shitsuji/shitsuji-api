import { Component, Inject } from '@nestjs/common';
import { Checkout, CloneOptions, Revwalk } from 'nodegit';
import * as nodeGit from 'nodegit';
import { Commit } from 'nodegit/commit';
import { Repository } from 'nodegit/repository';
import * as path from 'path';
import { CONFIG, CONFIG_FILE_LOCATION, GIT, HISTORY_LIMIT } from '../../constants';
import { CommitCreateDto } from '../../models/commit-create.dto';
import { ShitsujiConfig } from '../../models/config.model';
import { Keypair } from '../../models/keypair.model';
import { ApplicationConfig, ConfigFile, ConfigPackage } from '../../models/webhook.model';

@Component()
export class RepositoryService {
  constructor(@Inject(GIT) private git: typeof nodeGit, @Inject(CONFIG) private config: ShitsujiConfig) {}

  async cloneRepository(url: string, repositoryName: string, keypair: Keypair) {
    let repository;

    try {
      repository = await this.openRepository(repositoryName);
    } catch (e) {
      repository = await this.git.Clone.clone(
        url,
        this.getRepositoryPath(repositoryName),
        this.getCloneOptions(keypair)
      );
    }

    return repository;
  }

  async walkHistoryFromHead(repo: Repository, branch: string): Promise<ConfigPackage[]> {
    await repo.checkoutBranch(branch, {
      checkoutStrategy: Checkout.STRATEGY.FORCE
    });
    const headCommit = await repo.getHeadCommit();

    const walker = (repo as any).createRevWalk();
    walker.push(headCommit.id());
    walker.sorting(Revwalk.SORT.TIME);

    const firstWindow = await walker.fileHistoryWalk(CONFIG_FILE_LOCATION, HISTORY_LIMIT);
    const entries = await this.getFileHistory(repo, [], firstWindow);

    return Promise.all<ConfigPackage>(entries.map(async ({ commit }) => {
      commit.repo = repo;
      const config = await this.findSource(commit);
      const commitDto = this.commitToCommitCreateDto(commit);

      return {
        config,
        commit: commitDto
      };
    }));
  }

  async readVersion(repositoryName: string, hash: string): Promise<ConfigPackage> {
    const commit = await this.checkoutCommit(repositoryName, hash);
    const config = await this.findSource(commit);
    const commitDto = this.commitToCommitCreateDto(commit);

    return {
      config,
      commit: commitDto
    };
  }

  private async findSource(commit: Commit): Promise<ConfigFile> {
    const entry = await commit.getEntry(CONFIG_FILE_LOCATION);
    const blob = await entry.getBlob();
    const source = JSON.parse(String(blob));

    return source;
  }

  private async checkoutCommit(repositoryName: string, hash: string) {
    const repository = await this.openRepository(repositoryName);
    const commit = await repository.getCommit(hash);

    return commit;
  }

  private async checkoutHead(repositoryName: string) {
    const repository = await this.openRepository(repositoryName);
    const commit = await repository.getHeadCommit();

    return commit;
  }

  private async openRepository(repositoryName: string) {
    return this.git.Repository.open(this.getRepositoryPath(repositoryName));
  }

  private getRepositoryPath(repositoryName: string) {
    return path.resolve(this.config.storagePath, repositoryName);
  }

  private getCloneOptions(keypair: Keypair): CloneOptions {
    return {
      fetchOpts: {
        callbacks: {
          certificateCheck: () => true,
          credentials: (url, userName) => this.git.Cred.sshKeyMemoryNew(
            userName,
            keypair.publicKey,
            keypair.privateKey,
            ''
          )
        }
      }
    };
  }

  private async getFileHistory(repo: Repository, commits: any[], currentWindow?: any[]) {
    let lastId;
    if (commits.length > 0) {
      lastId = commits[commits.length - 1].commit.id();

      if (currentWindow.length === 1 && currentWindow[0].commit.id().tostrS() === lastId.tostrS()) {
        return commits;
      }
    }

    commits = [...commits, ...currentWindow];

    lastId = commits[commits.length - 1].commit.id();
    const walker = (repo as any).createRevWalk();
    walker.push(lastId);
    walker.sorting(Revwalk.SORT.TIME);

    const nextWindow = await walker.fileHistoryWalk(CONFIG_FILE_LOCATION, HISTORY_LIMIT);
    return this.getFileHistory(repo, commits, nextWindow);
  }

  private commitToCommitCreateDto(commit: Commit): CommitCreateDto {
    return {
      author: commit.author().toString(),
      hash: commit.sha(),
      message: commit.message()
    };
  }
}
