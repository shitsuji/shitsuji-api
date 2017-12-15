import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RepositoryDto } from '../../models/repository.dto';
import { CryptoService } from '../../services/crypto/crypto.service';
import { DatabaseService } from '../../services/database/database.service';
import { RepositoryService } from '../../services/repository/repository.service';

@Controller('repositories')
export class RepositoryController {
  constructor(private repositoryService: RepositoryService, private databaseService: DatabaseService,
    private cryptoService: CryptoService) {
      this.create(null);
    }

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

    return statement.all();
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

    delete (repository as any).privateKey;
    return repository;
  }
}
