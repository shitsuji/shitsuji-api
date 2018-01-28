import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {VersionService} from './version.service';
import {expect} from 'chai';

describe('VersionService', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      components: [
        VersionService
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let service: VersionService;
  beforeEach(() => {
    service = module.get(VersionService);
  });

  it('should exist', () => {
    expect(service).to.exist;
  });
});
