import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { Record } from 'orientjs';
import { RepositoryDto } from '../../models/repository.dto';
import { RepositoryModel } from '../../models/repository.model';
import { CryptoService } from '../../services/crypto/crypto.service';
import { DatabaseService } from '../../services/database/database.service';
import { WebhookService } from '../../services/webhook/webhook.service';

@Controller('repositories')
export class RepositoryController {
  constructor(private cryptoService: CryptoService, private databaseService: DatabaseService,
    private webhookService: WebhookService) {}

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

  @Get('/:repositoryId')
  async getById(@Param('repositoryId') repositoryId: string) {
    return this.databaseService.db.record.get(`#${repositoryId}`);
  }

  @Post('/')
  async create(@Body() repositoryDto: RepositoryDto) {
    const { privateKey, publicKey } = await this.cryptoService.generateKeypair();
    const encrypted = this.cryptoService.encrypt(privateKey);

    const repository = await this.databaseService.db.insert()
      .into('Repository')
      .set({
        ...repositoryDto,
        publicKey,
        privateKey: encrypted
      })
      .one();

    return this.repositoryToDto(repository);
  }

  @Patch('/:repositoryId')
  async updateById(@Param('repositoryId') repositoryId: string, @Body() body: RepositoryDto) {
    const { name, url, branch } = body;
    const data = { name, url, branch: branch && branch.length ? branch : 'master' };
    const repository = await this.databaseService.db
      .update(`#${repositoryId}`)
      .set(data)
      .return('AFTER')
      .one();

    return this.repositoryToDto(repository);
  }

  @Post('/:repositoryId/regenerate')
  async regenerateCertificate(@Param('repositoryId') repositoryId: string) {
    const { privateKey, publicKey } = await this.cryptoService.generateKeypair();
    const encrypted = this.cryptoService.encrypt(privateKey);

    const repository = await this.databaseService.db
      .update(`#${repositoryId}`)
      .set({
        publicKey,
        privateKey: encrypted
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
      .one() as Record & RepositoryModel;

    if (!repository) {
      throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
    }

    await this.webhookService.initialize(repository);

    const applications = await this.getApplications(repositoryId);

    return {
      repository: this.repositoryToDto(repository),
      applications
    };
  }

  @Get('/:repositoryId/applications')
  async getApplications(@Param('repositoryId') repositoryId: string) {
    return this.databaseService.db
      .select(`expand(in('IsIn'))`)
      .from('Repository')
      .where({
        '@rid': `#${repositoryId}`
      })
      .all();
  }

  @Delete('/:repositoryId')
  async deleteRepository(@Param('repositoryId') repositoryId: string) {
    return this.databaseService.db
      .delete(['VERTEX', 'Repository'])
      .where({
        '@rid': `#${repositoryId}`
      })
      .one();
  }

  private repositoryToDto(repository) {
    delete (repository as any).privateKey;
    return repository;
  }
}
