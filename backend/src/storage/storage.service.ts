import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  resolveAssetUrl(pathOrUrl: string | null | undefined) {
    if (!pathOrUrl) {
      return null;
    }

    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }

    return pathOrUrl;
  }
}
