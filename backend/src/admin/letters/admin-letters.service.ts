import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ListAdminLettersQueryDto } from './dto/list-admin-letters-query.dto';

@Injectable()
export class AdminLettersService {
  constructor(private readonly prisma: PrismaService) {}

  async listLetters(query: ListAdminLettersQueryDto) {
    const where: Prisma.LetterWhereInput = {
      ...(query.unreadOnly ? { isRead: false } : {}),
      ...(query.search
        ? {
            OR: [
              { senderName: { contains: query.search, mode: 'insensitive' } },
              { title: { contains: query.search, mode: 'insensitive' } },
              { body: { contains: query.search, mode: 'insensitive' } }
            ]
          }
        : {})
    };

    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.letter.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.letter.count({ where })
    ]);

    return { items, total, page, pageSize };
  }

  async getLetter(id: string) {
    const letter = await this.prisma.letter.findUnique({ where: { id } });
    if (!letter) {
      throw new NotFoundException('Letter not found');
    }
    return letter;
  }

  async markAsRead(id: string) {
    await this.getLetter(id);
    await this.prisma.letter.update({ where: { id }, data: { isRead: true } });
    return { success: true };
  }

  async deleteLetter(id: string) {
    await this.getLetter(id);
    await this.prisma.letter.delete({ where: { id } });
    return { success: true };
  }
}
