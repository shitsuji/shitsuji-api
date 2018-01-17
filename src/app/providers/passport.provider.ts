import * as _jsonwebtoken from 'jsonwebtoken';
import * as _passport from 'passport';
import * as _passportJwt from 'passport-jwt';
import { AUTH_SECRET, AUTH_TOKEN_EXPIRATION, JSONWEBTOKEN, PASSPORT, PASSPORT_JWT } from '../constants';

export const AuthTokenExpirationProvider = {
  provide: AUTH_TOKEN_EXPIRATION,
  useValue: AUTH_TOKEN_EXPIRATION
};

export const AuthSecretProvider = {
  provide: AUTH_SECRET,
  useValue: AUTH_SECRET
};

export const JsonWebTokenProvider = {
  provide: JSONWEBTOKEN,
  useValue: _jsonwebtoken
};

export const PassportProvider = {
  provide: PASSPORT,
  useValue: _passport
};

export const PassportJwtProvider = {
  provide: PASSPORT_JWT,
  useValue: _passportJwt
};
