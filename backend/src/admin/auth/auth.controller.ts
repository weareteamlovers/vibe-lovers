import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('admin')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(dto);
    response.cookie(this.authService.getCookieName(), result.token, this.authService.getCookieOptions());
    return { success: true, admin: result.admin };
  }

  @Post('auth/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.authService.getCookieName(), this.authService.getClearCookieOptions());
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentAdmin() admin: { id: string; email: string }) {
    return admin;
  }
}
