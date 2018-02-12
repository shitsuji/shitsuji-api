import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { parse } from 'yargs';
import { DATABASE_CONFIG, DATABASE_CONFIG_DEFAULTS } from '../constants';

export async function databaseConfigFactory() {
  const defaultConfigPath = path.join(process.env.ROOT_DIR, 'orientjs.opts');
  const desiredConfigPath = process.env.ORIENTDB_OPTS_FILE || defaultConfigPath;

  let rawConfig;

  try {
    rawConfig = await util.promisify(fs.readFile)(
      desiredConfigPath,
      { encoding: 'utf8' }
    );
  } catch (e) {
    console.log('Database config not found, continuing with defaults ...');
    rawConfig = '';
  }


  const parsedConfig = parseOptsFile(rawConfig);
  const configKeys = Object.keys(DATABASE_CONFIG_DEFAULTS);
  const config = {
    ...configKeys.reduce((acc, key) => ({
      ...acc,
      [key]: parsedConfig[key] || DATABASE_CONFIG_DEFAULTS[key]
    }), {}) as typeof DATABASE_CONFIG_DEFAULTS
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
