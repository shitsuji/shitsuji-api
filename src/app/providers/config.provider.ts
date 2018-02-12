import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { CONFIG, CONFIG_DEFAULTS } from '../constants';
import { ShitsujiConfig } from '../models/config.model';

export async function configFactory() {
  const defaultConfigPath = path.join(process.env.ROOT_DIR, 'shitsujiconfig.json');
  const desiredConfigPath = process.env.SHITSUJI_CONFIG_FILE || defaultConfigPath;

  let configData;
  
  try {
    configData = await util.promisify(fs.readFile)(
      desiredConfigPath,
      { encoding: 'utf8' }
    );
  } catch (e) {
    console.log('Shitsuji config not found, continuing with defaults ...');
    configData = {};
  }

  const config: ShitsujiConfig = {
    ...CONFIG_DEFAULTS,
    ...JSON.parse(configData)
  };

  if (process.env.SHITSUJI_CONFIG_STORAGE_PATH) {
    config.storagePath = path.relative(process.env.SHITSUJI_CONFIG_STORAGE_PATH, process.env.ROOT_DIR);
  } else {
    config.storagePath = path.join(process.env.ROOT_DIR, config.storagePath);
  }

  if (process.env.SHITSUJI_CONFIG_SECRET) {
    config.secret = process.env.SHITSUJI_CONFIG_SECRET;
  }

  return config;
}

export const configProvider = {
  provide: CONFIG,
  useFactory: configFactory
};
