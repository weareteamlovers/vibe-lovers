import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLetterDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  senderName?: string;

  @IsBoolean()
  isAnonymous!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  body!: string;

  @IsOptional()
  @IsString()
  website?: string;
}
