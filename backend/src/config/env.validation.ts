import { plainToInstance } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUrl, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  NODE_ENV!: string;

  @IsInt()
  PORT!: number;

  @IsString()
  DATABASE_URL!: string;

  @IsUrl({ require_tld: false })
  FRONTEND_ORIGIN!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  JWT_EXPIRES_IN!: string;

  @IsString()
  ADMIN_COOKIE_NAME!: string;

  @IsString()
  ADMIN_EMAIL!: string;

  @IsString()
  ADMIN_PASSWORD!: string;

  @IsString()
  GITHUB_USERNAME!: string;

  @IsOptional()
  @IsString()
  GITHUB_TOKEN?: string;

  @IsInt()
  GITHUB_CACHE_TTL_MINUTES!: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
