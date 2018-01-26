import { CommitCreateDto } from './commit-create.dto';

export enum WebhookAction {
  Initialize,
  Push
}

export interface WebhookCommand {
  type: WebhookAction;
  payload: any;
}

export interface ConfigPackage {
  commit: CommitCreateDto;
  config: ConfigFile;
}

export interface ConfigFile {
  applications: ApplicationConfig[];
}

export interface ApplicationConfig {
  key: string;
  version: string;
  dependencies?: DependencyConfig[];
}

export interface DependencyConfig {
  key: string;
  version: string;
}

export enum CommandType {
  GetOrCreateApplication,
  GetOrCreateApplicationVersion,
  ConnectVersions,
  ConnectApplicationToRepository
}
