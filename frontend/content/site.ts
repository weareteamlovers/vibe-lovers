import { MediaItem, ProjectItem, TrackItem } from '@/lib/types';

export const siteIntro = {
  title: '팀사랑꾼들',
  subtitle: '팀사랑꾼들은 한국의 락 밴드이자 AI Engineering Group 입니다.',
  marquee:
    '팀사랑꾼들은 여러분을 사랑합니다 teamlovers'
};

export const contactLinks = [
  { label: '인스타그램', href: 'https://www.instagram.com/weareteamlovers' },
  { label: '유튜브', href: 'https://www.youtube.com/@weareteamlovers' },
  { label: '네이버 블로그', href: 'https://m.blog.naver.com/teamlovers' },
  { label: '개발 블로그', href: 'https://velog.io/@teamlovers' },
  { label: 'GitHub', href: 'https://github.com/weareteamlovers' }
];

export const fallbackMedia: MediaItem[] = [
  {
    id: 'media-1',
    type: 'image',
    title: 'Neon editorial still',
    src: '/placeholders/poster-01.svg',
    alt: 'Abstract poster placeholder',
    caption: '빛, 잔향, 편집적 리듬',
    width: 900,
    height: 1200,
    order: 1
  },
  {
    id: 'media-2',
    type: 'video',
    title: 'Studio atmosphere reel',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: '/placeholders/poster-02.svg',
    alt: 'Studio atmosphere placeholder video',
    caption: '전시형 영상 프레임',
    width: 1280,
    height: 720,
    order: 2
  },
  {
    id: 'media-3',
    type: 'image',
    title: 'Gallery wall poster',
    src: '/placeholders/poster-03.svg',
    alt: 'Gallery poster placeholder',
    caption: '포스터 월의 밀도',
    width: 1200,
    height: 1500,
    order: 3
  },
  {
    id: 'media-4',
    type: 'image',
    title: 'Muted magazine sheet',
    src: '/placeholders/poster-04.svg',
    alt: 'Muted magazine placeholder',
    caption: '잡지 같은 여백과 질감',
    width: 1000,
    height: 1300,
    order: 4
  },
  {
    id: 'media-5',
    type: 'video',
    title: 'Night moving texture',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    poster: '/placeholders/poster-05.svg',
    alt: 'Moving texture placeholder video',
    caption: '잔잔한 움직임과 깊이',
    width: 1280,
    height: 720,
    order: 5
  },
  {
    id: 'media-6',
    type: 'image',
    title: 'Sound archive print',
    src: '/placeholders/poster-06.svg',
    alt: 'Sound archive poster placeholder',
    caption: '음악과 공학의 포스터 아카이브',
    width: 900,
    height: 1200,
    order: 6
  }
];

export const fallbackProjects: ProjectItem[] = [
  {
    id: 1,
    name: 'ear-showroom',
    description: '전시형 포트폴리오를 위한 풀스택 실험 공간',
    htmlUrl: 'https://github.com/weareteamlovers',
    homepage: '',
    language: 'TypeScript',
    topics: ['editorial', 'portfolio', 'motion'],
    stargazersCount: 8,
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'band-notes',
    description: '싱어송라이터 메모, 트랙 아이디어, 사운드 스케치 아카이브',
    htmlUrl: 'https://github.com/weareteamlovers',
    homepage: '',
    language: 'Next.js',
    topics: ['music', 'archive', 'creative-tech'],
    stargazersCount: 12,
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'ai-letter-room',
    description: '익명 편지와 관리자 인박스를 위한 안전한 메시지 시스템',
    htmlUrl: 'https://github.com/weareteamlovers',
    homepage: '',
    language: 'NestJS',
    topics: ['backend', 'prisma', 'letters'],
    stargazersCount: 5,
    updatedAt: new Date().toISOString()
  }
];

export const fallbackTracks: TrackItem[] = [
  {
    id: 'track-1',
    title: '새벽의 아카이브',
    artist: '팀사랑꾼들',
    durationSeconds: 356,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: '/covers/cover-01.svg',
    order: 1
  },
  {
    id: 'track-2',
    title: '연약한 전시',
    artist: '팀사랑꾼들',
    durationSeconds: 289,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: '/covers/cover-02.svg',
    order: 2
  },
  {
    id: 'track-3',
    title: '신호와 밤',
    artist: '팀사랑꾼들',
    durationSeconds: 314,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: '/covers/cover-03.svg',
    order: 3
  }
];
