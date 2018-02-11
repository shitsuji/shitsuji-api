import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { CONFIG, CONFIG_DEFAULTS } from '../constants';
import { ShitsujiConfig } from '../models/config.model';

export async function configFactory() {
  const rootDir = process.env.ROOT_DIR || `${__dirname}/../../..`;
  const defaultConfigPath = path.join(rootDir, 'shitsujiconfig.json');
  const desiredConfigPath = process.env.SHITSUJI_CONFIG_FILE || defaultConfigPath;

  const configData = await util.promisify(fs.readFile)(
    desiredConfigPath,
    { encoding: 'utf8' }
  );

  const config: ShitsujiConfig = {
    ...CONFIG_DEFAULTS,
    ...JSON.parse(configData)
  };

  if (process.env.SHITSUJI_CONFIG_STORAGE_PATH) {
    config.storagePath = process.env.SHITSUJI_CONFIG_STORAGE_PATH;
  }

  if (process.env.SHITSUJI_CONFIG_SECRET) {
    config.secret = process.env.SHITSUJI_CONFIG_SECRET;
  }

  config.storagePath = path.join(rootDir, config.storagePath);

  return config;
}

export const configProvider = {
  provide: CONFIG,
  useFactory: configFactory
};
