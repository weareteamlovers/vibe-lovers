import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { CreateLetterDto } from './dto/create-letter.dto';

@Injectable()
export class LettersService {
  constructor(private readonly prisma: PrismaService) {}

  async createLetter(dto: CreateLetterDto, metadata: { ip?: string | null; userAgent?: string | null }) {
    if (dto.website) {
      throw new BadRequestException('Spam detected');
    }

    const ipHash = metadata.ip
      ? createHash('sha256')
          .update(metadata.ip)
          .digest('hex')
      : null;

    await this.prisma.letter.create({
      data: {
        senderName: dto.isAnonymous ? null : dto.senderName || null,
        title: dto.title || null,
        body: dto.body,
        isAnonymous: dto.isAnonymous,
        ipHash,
        userAgent: metadata.userAgent || null
      }
    });

    return {
      success: true,
      message: '편지가 안전하게 전달되었습니다.'
    };
  }
}
