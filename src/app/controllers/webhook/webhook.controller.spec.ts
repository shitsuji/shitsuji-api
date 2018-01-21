import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {WebhookController} from './webhook.controller';
import {expect} from 'chai';

describe('WebhookController', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      controllers: [
        WebhookController
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let controller: WebhookController;
  beforeEach(() => {
    controller = module.get(WebhookController);
  });

  it('should exist', () => {
    expect(controller).to.exist;
  });
});
