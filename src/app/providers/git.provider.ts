import * as git from 'nodegit';
import { GIT } from '../constants';

export function gitFactory() {
  return git;
}

export const gitProvider = {
  provide: GIT,
  useFactory: gitFactory
};
