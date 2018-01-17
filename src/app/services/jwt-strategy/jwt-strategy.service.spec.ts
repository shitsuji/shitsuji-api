import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {JwtStrategyService} from './jwt-strategy.service';
import {expect} from 'chai';

describe('JwtStrategyService', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      components: [
        JwtStrategyService
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let service: JwtStrategyService;
  beforeEach(() => {
    service = module.get(JwtStrategyService);
  });

  it('should exist', () => {
    expect(service).to.exist;
  });
});
