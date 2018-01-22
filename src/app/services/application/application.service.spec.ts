import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {ApplicationService} from './application.service';
import {expect} from 'chai';

describe('ApplicationService', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      components: [
        ApplicationService
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let service: ApplicationService;
  beforeEach(() => {
    service = module.get(ApplicationService);
  });

  it('should exist', () => {
    expect(service).to.exist;
  });
});
