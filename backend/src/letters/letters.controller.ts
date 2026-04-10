import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { LettersService } from './letters.service';
import { CreateLetterDto } from './dto/create-letter.dto';

@Controller('letters')
export class LettersController {
  constructor(private readonly lettersService: LettersService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  createLetter(@Body() dto: CreateLetterDto, @Ip() ip: string, @Req() request: Request) {
    return this.lettersService.createLetter(dto, {
      ip,
      userAgent: request.get('user-agent') ?? null
    });
  }
}
