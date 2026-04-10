import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';

type GithubRepositoryResponse = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  updated_at: string;
};

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async listProjects(query: ListProjectsQueryDto) {
    const repositories = await this.fetchRepositories();
    let curated = repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      htmlUrl: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      topics: repo.topics ?? [],
      stargazersCount: repo.stargazers_count,
      updatedAt: repo.updated_at
    }));

    if (query.q) {
      const q = query.q.toLowerCase();
      curated = curated.filter((repo) => {
        return [repo.name, repo.description ?? '', ...(repo.topics ?? [])]
          .join(' ')
          .toLowerCase()
          .includes(q);
      });
    }

    if (query.language) {
      curated = curated.filter((repo) => (repo.language ?? '').toLowerCase() === query.language?.toLowerCase());
    }

    const sort = query.sort ?? 'updated';
    curated.sort((a, b) => {
      if (sort === 'stars') return b.stargazersCount - a.stargazersCount;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return curated;
  }

  private async fetchRepositories() {
    const cacheTtlMinutes = this.configService.get<number>('GITHUB_CACHE_TTL_MINUTES', 30);
    const cached = await this.prisma.cachedGithubRepo.findMany({
      where: {
        fetchedAt: {
          gte: new Date(Date.now() - cacheTtlMinutes * 60 * 1000)
        }
      },
      orderBy: { updatedAtGitHub: 'desc' }
    });

    if (cached.length > 0) {
      return cached.map((repo) => repo.payload as GithubRepositoryResponse);
    }

    const username = this.configService.get<string>('GITHUB_USERNAME');
    const token = this.configService.get<string>('GITHUB_TOKEN');

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API failed: ${response.status}`);
      }

      const data = (await response.json()) as GithubRepositoryResponse[];
      const normalized = data.map((repo) => ({
        repoId: String(repo.id),
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        topics: repo.topics ?? [],
        stargazersCount: repo.stargazers_count,
        updatedAtGitHub: new Date(repo.updated_at),
        payload: repo,
        fetchedAt: new Date()
      }));

      await this.prisma.$transaction([
        this.prisma.cachedGithubRepo.deleteMany(),
        this.prisma.cachedGithubRepo.createMany({ data: normalized })
      ]);

      return data;
    } catch (error) {
      this.logger.warn('Falling back to stale GitHub cache');
      const staleCache = await this.prisma.cachedGithubRepo.findMany({ orderBy: { updatedAtGitHub: 'desc' } });
      if (staleCache.length > 0) {
        return staleCache.map((repo) => repo.payload as GithubRepositoryResponse);
      }
      throw error;
    }
  }
}
