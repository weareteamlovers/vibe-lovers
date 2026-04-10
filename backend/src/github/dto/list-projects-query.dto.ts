import { IsIn, IsOptional, IsString } from 'class-validator';

export class ListProjectsQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsIn(['updated', 'stars', 'name'])
  sort?: 'updated' | 'stars' | 'name';
}
