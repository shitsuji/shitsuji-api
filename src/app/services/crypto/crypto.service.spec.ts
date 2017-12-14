import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {CryptoService} from './crypto.service';
import {expect} from 'chai';

describe('CryptoService', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      components: [
        CryptoService
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let service: CryptoService;
  beforeEach(() => {
    service = module.get(CryptoService);
  });

  it('should exist', () => {
    expect(service).to.exist;
  });
});
