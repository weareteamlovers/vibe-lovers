import { Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminLettersService } from './admin-letters.service';
import { ListAdminLettersQueryDto } from './dto/list-admin-letters-query.dto';

@Controller('admin/letters')
@UseGuards(JwtAuthGuard)
export class AdminLettersController {
  constructor(private readonly adminLettersService: AdminLettersService) {}

  @Get()
  listLetters(@Query() query: ListAdminLettersQueryDto) {
    return this.adminLettersService.listLetters(query);
  }

  @Get(':id')
  getLetter(@Param('id') id: string) {
    return this.adminLettersService.getLetter(id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.adminLettersService.markAsRead(id);
  }

  @Delete(':id')
  deleteLetter(@Param('id') id: string) {
    return this.adminLettersService.deleteLetter(id);
  }
}
