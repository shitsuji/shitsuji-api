import {INestApplication} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { ApplicationModule } from './app/app.module';

const PORT = +process.env.PHRYNE_PORT || 5000;

async function bootstrap() {
  const instance = express();
  const app = await NestFactory.create(ApplicationModule, instance);

  app.use(cors());
  app.use(bodyParser.json());

  await app.listen(PORT);
  console.log(`Shitsuji running at port ${PORT}`);
}

bootstrap();
