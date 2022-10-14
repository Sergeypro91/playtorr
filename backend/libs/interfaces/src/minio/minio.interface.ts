import { ModuleMetadata } from '@nestjs/common';

export interface MinIOOptions {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucketName: string;
}

export interface MinIOModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<MinIOOptions> | MinIOOptions;
  inject?: any[];
}
