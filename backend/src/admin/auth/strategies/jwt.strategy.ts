import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: { cookies?: Record<string, string> }) => {
          const cookieName = configService.get<string>('ADMIN_COOKIE_NAME', 'teamlovers_admin');
          return request?.cookies?.[cookieName] ?? null;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const admin = await this.prisma.adminUser.findUnique({ where: { id: payload.sub } });
    if (!admin) {
      throw new UnauthorizedException('Admin session is invalid');
    }

    return { id: admin.id, email: admin.email };
  }
}
