import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RepositoryDto } from '../../models/repository.dto';
import { CryptoService } from '../../services/crypto/crypto.service';
import { DatabaseService } from '../../services/database/database.service';

@Controller('repositories')
export class RepositoryController {
  constructor(private cryptoService: CryptoService, private databaseService: DatabaseService) {}

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
    const { name, url } = body;
    const data = { name, url };

    const repository = await this.databaseService.db
      .update(`#${repositoryId}`)
      .set(data)
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
  }

  private repositoryToDto(repository) {
    delete (repository as any).privateKey;
    return repository;
  }
}
