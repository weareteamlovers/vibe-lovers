import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.prisma.adminUser.findUnique({ where: { email: dto.email } });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync(
      { sub: admin.id, email: admin.email },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d')
      }
    );

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    };
  }

  getCookieName() {
    return this.configService.get<string>('ADMIN_COOKIE_NAME', 'teamlovers_admin');
  }

  getCookieOptions() {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7
    };
  }

  getClearCookieOptions() {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      path: '/'
    };
  }
}

