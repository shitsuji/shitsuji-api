import { Body, Controller, Param, Post } from '@nestjs/common';
import { Record } from 'orientjs';
import { WebhookAction } from '../../constants';
import { RepositoryModel } from '../../models/repository.model';
import { DatabaseService } from '../../services/database/database.service';
import { WebhookService } from '../../services/webhook/webhook.service';

interface WebhookCommand {
  type: WebhookAction;
  payload: any;
}

@Controller('webhook')
export class WebhookController {
  constructor(private databaseService: DatabaseService, private webhookService: WebhookService) {}

  @Post('/:key')
  async webhook(@Param('key') key: string, @Body() body) {
    const command = this.handleGithub(body);

    if (!command) {
      return {};
    }

    const repository = await this.databaseService.db
      .select()
      .where({ key })
      .from('Repository')
      .one() as Record & RepositoryModel;

    switch (command.type) {
      case WebhookAction.Push: {
        return this.webhookService.push(repository, command.payload);
      }
      case WebhookAction.Initialize: {
        return this.webhookService.initialize(repository);
      }
    }

    return {};
  }

  private handleGithub(payload): WebhookCommand {
    const { ref, after, hook } = payload;

    // If we have ref and after we assume it's an push event
    // for more details see: https://developer.github.com/v3/activity/events/types/#pushevent
    if (ref && after) {
      const refs = (ref as string).split('/');
      const branch = refs[refs.length - 1];

      return {
        type: WebhookAction.Push,
        payload: {
          branch,
          hash: after
        }
      };
    }

    // If we have hook property, we assume it's a ping from Github
    // and initialize repository as it was freshly added
    if (hook) {
      return {
        type: WebhookAction.Initialize,
        payload: {}
      };
    }

    return null;
  }
}
