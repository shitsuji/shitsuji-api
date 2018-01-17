import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {UserController} from './user.controller';
import {expect} from 'chai';

describe('UserController', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      controllers: [
        UserController
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let controller: UserController;
  beforeEach(() => {
    controller = module.get(UserController);
  });

  it('should exist', () => {
    expect(controller).to.exist;
  });
});
