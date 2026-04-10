import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TracksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService
  ) {}

  async listTracks() {
    const tracks = await this.prisma.track.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' }
    });

    return tracks.map((track) => ({
      ...track,
      audioUrl: this.storageService.resolveAssetUrl(track.audioUrl),
      coverUrl: this.storageService.resolveAssetUrl(track.coverUrl)
    }));
  }
}
