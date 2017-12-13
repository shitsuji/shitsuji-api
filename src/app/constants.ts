import { ShitsujiConfig } from './models/config.model';

export const GIT = 'GIT';
export const CONFIG = 'CONFIG';

export const CONFIG_DEFAULTS: ShitsujiConfig = {
  storagePath: './storage',
  certPath: './cert',
  certPassword: '1234567890'
};
