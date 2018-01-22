import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {WebhookService} from './webhook.service';
import {expect} from 'chai';

describe('WebhookService', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      components: [
        WebhookService
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let service: WebhookService;
  beforeEach(() => {
    service = module.get(WebhookService);
  });

  it('should exist', () => {
    expect(service).to.exist;
  });
});
