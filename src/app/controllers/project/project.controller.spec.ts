import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {ProjectController} from './project.controller';
import {expect} from 'chai';

describe('ProjectController', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      controllers: [
        ProjectController
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let controller: ProjectController;
  beforeEach(() => {
    controller = module.get(ProjectController);
  });

  it('should exist', () => {
    expect(controller).to.exist;
  });
});
