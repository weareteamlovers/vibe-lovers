import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListAdminLettersQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 1))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value ?? 20))
  @IsInt()
  @Min(1)
  pageSize?: number = 20;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  unreadOnly?: boolean = false;

  @IsOptional()
  @IsString()
  search?: string;
}
