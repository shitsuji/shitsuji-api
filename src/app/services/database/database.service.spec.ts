import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {DatabaseService} from './database.service';
import {expect} from 'chai';

describe('DatabaseService', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      components: [
        DatabaseService
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let service: DatabaseService;
  beforeEach(() => {
    service = module.get(DatabaseService);
  });

  it('should exist', () => {
    expect(service).to.exist;
  });
});
