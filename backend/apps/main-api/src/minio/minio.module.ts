import { Global, Module, Provider, DynamicModule } from '@nestjs/common';
import { MinIOModuleAsyncOptions } from '@app/interfaces/minio/minio.interface';
import { MINIO_MODULE_OPTIONS } from '@app/contracts/minio/minio.constants';
import { MinIOService } from './minio.service';

@Global()
@Module({})
export class MinIOModule {
  static forRootAsync(options: MinIOModuleAsyncOptions): DynamicModule {
    const asyncOptions = this.createAsyncOptionsProvider(options);

    return {
      module: MinIOModule,
      imports: options.imports,
      providers: [MinIOService, asyncOptions],
      exports: [MinIOService],
    };
  }

  private static createAsyncOptionsProvider(
    options: MinIOModuleAsyncOptions,
  ): Provider {
    return {
      provide: MINIO_MODULE_OPTIONS,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);

        return config;
      },
      inject: options.inject || [],
    };
  }
}
