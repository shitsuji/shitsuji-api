import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { parse } from 'yargs';
import { DATABASE_CONFIG, DATABASE_CONFIG_DEFAULTS } from '../constants';

export async function databaseConfigFactory() {
  const rootDir = process.env.ROOT_DIR || `${__dirname}/../../..`;
  const defaultConfigPath = path.join(rootDir, 'orientjs.opts');
  const desiredConfigPath = process.env.ORIENTDB_OPTS_FILE || defaultConfigPath;

  const rawConfig = await util.promisify(fs.readFile)(
    desiredConfigPath,
    { encoding: 'utf8' }
  );
  const parsedConfig = parseOptsFile(rawConfig);
  const configKeys = Object.keys(DATABASE_CONFIG_DEFAULTS);
  const config = {
    ...DATABASE_CONFIG_DEFAULTS,
    ...configKeys.reduce((acc, key) => ({ ...acc, [key]: parsedConfig[key] }), {})
  };

  if (process.env.ORIENTDB_HOST) {
    config.host = process.env.ORIENTDB_HOST;
  }

  if (process.env.ORIENTDB_PORT) {
    config.port = +process.env.ORIENTDB_PORT;
  }

  if (process.env.ORIENTDB_DB_NAME) {
    config.name = process.env.ORIENTDB_DB_NAME;
  }

  if (process.env.ORIENTDB_DB_USER) {
    config.username = process.env.ORIENTDB_DB_USER;
  }

  if (process.env.ORIENTDB_DB_PASSWORD) {
    config.password = process.env.ORIENTDB_DB_PASSWORD;
  }

  return config;
}

function parseOptsFile(content) {
  const args = content.trim().split(/\s+/);
  return parse(args);
}

export const databaseConfigProvider = {
  provide: DATABASE_CONFIG,
  useFactory: databaseConfigFactory
};
