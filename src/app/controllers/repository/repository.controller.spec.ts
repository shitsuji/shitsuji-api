import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {expect} from 'chai';
import {RepositoryController} from './repository.controller';

describe('RepositoryController', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      controllers: [
        RepositoryController
      ]
    }).compile()
      .then((compiledModule) => module = compiledModule);
  });

  let controller: RepositoryController;
  beforeEach(() => {
    controller = module.get(RepositoryController);
  });

  it('should exist', () => {
    expect(controller).to.exist;
  });
});
