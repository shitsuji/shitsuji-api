import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { CONFIG, CONFIG_DEFAULTS } from '../constants';
import { ShitsujiConfig } from '../models/config.model';

export async function configFactory() {
  const rootDir = process.env.ROOT_DIR || `${__dirname}/../../..`;

  const configData = await util.promisify(fs.readFile)(
    path.join(rootDir, 'shitsujiconfig.json'),
    { encoding: 'utf8' }
  );

  const config: ShitsujiConfig = { ...CONFIG_DEFAULTS, ...JSON.parse(configData) };
  config.storagePath = path.join(rootDir, config.storagePath);

  return config;
}

export const configProvider = {
  provide: CONFIG,
  useFactory: configFactory
};
