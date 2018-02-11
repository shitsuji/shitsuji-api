import { Component, Inject } from '@nestjs/common';
import { ODatabase } from 'orientjs';
import { DATABASE_CONFIG } from '../../constants';

@Component()
export class DatabaseService {
  db: ODatabase;

  constructor(@Inject(DATABASE_CONFIG) databaseConfig) {
    this.db = new ODatabase(databaseConfig);
  }
}
