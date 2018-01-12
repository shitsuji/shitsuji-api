import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RepositoryDto } from '../../models/repository.dto';
import { CryptoService } from '../../services/crypto/crypto.service';
import { DatabaseService } from '../../services/database/database.service';
import { RepositoryService } from '../../services/repository/repository.service';

@Controller('repositories')
export class RepositoryController {
  constructor(private repositoryService: RepositoryService, private databaseService: DatabaseService,
    private cryptoService: CryptoService) {}

  @Get('/')
  async getAll(@Query('search') search: string) {
    let statement = this.databaseService.db
    .select()
    .from('Repository');

    if (search) {
      statement = statement.containsText({
        name: search
      });
    }

    const repositories = await statement.all();

    return repositories.map((repo) => this.repositoryToDto(repo));
  }

  @Post('/')
  async create(@Body() repositoryDto: RepositoryDto) {
    const { privateKey, publicKey } = await this.cryptoService.generateKeypair();
    const encrypted = this.cryptoService.encrypt(privateKey);

    const Repository = await this.databaseService.db.class.get('Repository');
    const repository = await Repository.create({
      ...repositoryDto,
      publicKey,
      privateKey: encrypted
    } as any);

    return this.repositoryToDto(repository);
  }

  @Patch('/:repositoryId')
  async updateById(@Param('repositoryId') repositoryId: string, @Body() body: RepositoryDto) {
    const repository = await this.databaseService.db
      .update(`#${repositoryId}`)
      .set(body as any)
      .return('AFTER')
      .one();

    return this.repositoryToDto(repository);
  }

  @Delete('/:repositoryId')
  async deleteById(@Param('repositoryId') repositoryId: string) {
    return this.databaseService.db
      .delete(`#${repositoryId}`)
      .one();
  }

  @Post('/:repositoryId/certificate')
  async createCertificate(@Param('repositoryId') repositoryId: string) {
    const { privateKey, publicKey } = await this.cryptoService.generateKeypair();
    const encrypted = this.cryptoService.encrypt(privateKey);

    const repository = await this.databaseService.db
      .update(`#${repositoryId}`)
      .set({
        privateKey,
        publicKey
      })
      .return('AFTER')
      .one();

    return this.repositoryToDto(repository);
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

  @Post('/:repositoryId/webhook')
  async webhook(@Param('repositoryId') repositoryId: string, @Body() body) {
    let hash;

    if (body.action && body.pull_request) {
      hash = this.handleGithub(body);
    }

    if (!hash) {
      return {};
    }

    const repository = await this.databaseService.db
      .select()
      .where({
        '@rid': repositoryId
      })
      .from('Repository')
      .one();

    const privateKey = this.cryptoService.decrypt((repository as any).privateKey);
    const { publicKey, url, name } = repository as any;

    const conf = await this.repositoryService.readVersion(name, hash);
    console.log(conf);
    // To-Do: logic to updated version in orient

    return {};
  }

  private repositoryToDto(repository) {
    delete (repository as any).privateKey;
    return repository;
  }

  private handleGithub(payload): string {
    const { action, pull_request } = payload;

    if (action !== 'merged') {
      return null;
    }

    return pull_request.head.sha;
  }
}
