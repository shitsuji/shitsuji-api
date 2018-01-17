import * as _bcrypt from 'bcrypt';
import { BCRYPT, SALT_ROUNDS, SALT_ROUNDS_TOKEN } from '../constants';

export const BcryptProvider = {
  provide: BCRYPT,
  useValue: _bcrypt
};

export const SaltRoundsProvider = {
  provide: SALT_ROUNDS_TOKEN,
  useValue: SALT_ROUNDS
};
