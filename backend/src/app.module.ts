import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validate } from './config/env.validation';
import { PrismaModule } from './database/prisma.module';
import { StorageModule } from './storage/storage.module';
import { GithubModule } from './github/github.module';
import { MediaModule } from './media/media.module';
import { TracksModule } from './tracks/tracks.module';
import { LettersModule } from './letters/letters.module';
import { AdminAuthModule } from './admin/auth/admin-auth.module';
import { AdminLettersModule } from './admin/letters/admin-letters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 30
      }
    ]),
    PrismaModule,
    StorageModule,
    GithubModule,
    MediaModule,
    TracksModule,
    LettersModule,
    AdminAuthModule,
    AdminLettersModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
