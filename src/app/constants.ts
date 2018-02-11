import { ShitsujiConfig } from './models/config.model';

export const GIT = 'GIT';
export const CONFIG = 'CONFIG';
export const DATABASE_CONFIG = 'DATABASE_CONFIG';

export const CONFIG_DEFAULTS: ShitsujiConfig = {
  storagePath: './storage',
  secret: 'there-should-be-stronger-secret...'
};

export const DATABASE_CONFIG_DEFAULTS = {
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'shitsuji',
  name: 'shitsuji'
};

export const BCRYPT = 'bcrypt';
export const SALT_ROUNDS = 10;
export const SALT_ROUNDS_TOKEN = 'SALT_ROUNDS_TOKEN';
export const AUTH_TOKEN_EXPIRATION = 60 * 60;
export const AUTH_SECRET = 'AUTH_SECRET';
export const JSONWEBTOKEN = 'jsonwebtoken';
export const PASSPORT = 'passport';
export const PASSPORT_JWT = 'passport-jwt';
export const HISTORY_LIMIT = 500;
export const CONFIG_FILE_LOCATION = process.env.SHITSUJI_REPOSITORY_CONFIG_FILE_PATH || 'shitsuji.json';
