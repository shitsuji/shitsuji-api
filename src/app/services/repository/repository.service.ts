import { Component, Inject } from '@nestjs/common';
import * as nodeGit from 'nodegit';
import { CloneOptions } from 'nodegit';
import * as path from 'path';
import { CONFIG, GIT } from '../../constants';
import { ShitsujiConfig } from '../../models/config.model';
import { Keypair } from '../../models/keypair.model';

@Component()
export class RepositoryService {
  constructor(@Inject(GIT) private git: typeof nodeGit, @Inject(CONFIG) private config: ShitsujiConfig) {}

  async cloneRepository(url: string, repositoryName: string, keypair: Keypair) {
    const repository = await this.git.Clone.clone(
      url,
      this.getRepositoryPath(repositoryName),
      this.getCloneOptions(keypair)
    );

    return repository;
  }

  async readVersion(repositoryName: string, hash: string) {
    const commit = await this.checkoutCommit(repositoryName, hash);

    const entry = await commit.getEntry('shitsuji.json');
    const blob = await entry.getBlob();
    const source = JSON.parse(String(blob));

    return source;
  }

  private async checkoutCommit(repositoryName: string, hash: string) {
    const repository = await this.openRepository(repositoryName);
    const commit = await repository.getCommit(hash);

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
          credentials: (url, userName) => this.git.Cred.sshKeyNew(
            userName,
            keypair.publicKey,
            keypair.privateKey,
            ''
          )
        }
      }
    };
  }
}