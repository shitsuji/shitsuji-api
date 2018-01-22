import { Component, Inject } from '@nestjs/common';
import * as nodeGit from 'nodegit';
import { Checkout, CloneOptions, Revwalk } from 'nodegit';
import { Commit } from 'nodegit/commit';
import { Repository } from 'nodegit/repository';
import * as path from 'path';
import { CONFIG, CONFIG_FILE_LOCATION, GIT, HISTORY_LIMIT } from '../../constants';
import { ShitsujiConfig } from '../../models/config.model';
import { Keypair } from '../../models/keypair.model';

@Component()
export class RepositoryService {
  constructor(@Inject(GIT) private git: typeof nodeGit, @Inject(CONFIG) private config: ShitsujiConfig) {}

  async cloneRepository(url: string, repositoryName: string, keypair: Keypair) {
    let repository;

    try {
      repository = this.openRepository(repositoryName);
    } catch (e) {
      repository = await this.git.Clone.clone(
        url,
        this.getRepositoryPath(repositoryName),
        this.getCloneOptions(keypair)
      );
    }

    return repository;
  }

  async walkHistoryFromHead(repo: Repository, branch: string) {
    await repo.checkoutBranch(branch, {
      checkoutStrategy: Checkout.STRATEGY.FORCE
    });
    const headCommit = await repo.getHeadCommit();

    const walker = (repo as any).createRevWalk();
    walker.push(headCommit.id());
    walker.sorting(Revwalk.SORT.TIME);

    const firstWindow = await walker.fileHistoryWalk(CONFIG_FILE_LOCATION, HISTORY_LIMIT);
    const entries = await this.getFileHistory(repo, [], firstWindow);

    return Promise.all(entries.map(({ commit }) => {
      commit.repo = repo;
      return this.findSource(commit);
    }));
  }

  async readVersion(repositoryName: string, hash: string) {
    const commit = await this.checkoutCommit(repositoryName, hash);

    return this.findSource(commit);
  }

  private async findSource(commit: Commit) {
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
    return path.join(this.config.storagePath, repositoryName);
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
}
