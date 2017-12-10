import { Component } from '@nestjs/common';
import { ODatabase } from 'orientjs';

@Component()
export class DatabaseService {
  db: ODatabase;

  constructor() {
    this.db = new ODatabase({
      host: 'localhost',
      port: 2424,
      username: 'root',
      password: 'shitsuji',
      name: 'shitsuji'
    });
  }
}
