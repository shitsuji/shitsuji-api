import { Body, Controller, Param, Post } from '@nestjs/common';
import { CryptoService } from '../../services/crypto/crypto.service';
import { DatabaseService } from '../../services/database/database.service';
import { RepositoryService } from '../../services/repository/repository.service';

@Controller('webhook')
export class WebhookController {
  constructor(private repositoryService: RepositoryService, private databaseService: DatabaseService,
    private cryptoService: CryptoService) {}

  @Post('/:key')
  async webhook(@Param('key') key: string, @Body() body) {
    let hash;

    if (body.action && body.pull_request) {
      hash = this.handleGithub(body);
    }

    if (!hash) {
      return {};
    }

    const repository = await this.databaseService.db
      .select()
      .where({ key })
      .from('Repository')
      .one();

    const privateKey = this.cryptoService.decrypt((repository as any).privateKey);
    const { publicKey, url, name } = repository as any;

    const conf = await this.repositoryService.readVersion(name, hash);
    console.log(conf);
    // To-Do: logic to updated version in orient

    return {};
  }

  @Post('/:repositoryId/initialize')
  async initialize(@Param('repositoryId') repositoryId: string) {
    const repository = await this.databaseService.db
    .select()
    .where({
      '@rid': repositoryId
    })
    .from('Repository')
    .one();

    const privateKey = this.cryptoService.decrypt((repository as any).privateKey);
    const { publicKey, url, name } = repository as any;

    const repo = await this.repositoryService.cloneRepository(url, name, {
      publicKey, privateKey
    });

    const conf = await this.repositoryService.readHead(name);

    console.log(conf);
    // To-Do: logic to updated version in orient

    return {};
  }

  private handleGithub(payload): string {
    const { action, pull_request } = payload;

    if (action !== 'merged') {
      return null;
    }

    return pull_request.head.sha;
  }
}
