import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from './github.service';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';

@Controller('projects')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get()
  listProjects(@Query() query: ListProjectsQueryDto) {
    return this.githubService.listProjects(query);
  }
}
