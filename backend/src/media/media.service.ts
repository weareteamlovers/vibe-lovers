import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService
  ) {}

  async listMedia() {
    const items = await this.prisma.mediaItem.findMany({ orderBy: { order: 'asc' } });
    return items.map((item) => ({
      ...item,
      src: this.storageService.resolveAssetUrl(item.src),
      poster: this.storageService.resolveAssetUrl(item.poster)
    }));
  }
}
