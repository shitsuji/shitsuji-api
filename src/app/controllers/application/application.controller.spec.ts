import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {ApplicationController} from './application.controller';
import {expect} from 'chai';

describe('ApplicationController', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      controllers: [
        ApplicationController
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let controller: ApplicationController;
  beforeEach(() => {
    controller = module.get(ApplicationController);
  });

  it('should exist', () => {
    expect(controller).to.exist;
  });
});
