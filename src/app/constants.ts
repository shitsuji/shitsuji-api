import { ShitsujiConfig } from './models/config.model';

export const GIT = 'GIT';
export const CONFIG = 'CONFIG';

export const CONFIG_DEFAULTS: ShitsujiConfig = {
  storagePath: './storage',
  secret: 'there-should-be-stronger-secret...'
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
export const CONFIG_FILE_LOCATION = 'shitsuji.json';

export enum WebhookAction {
  Initialize,
  Push
}
